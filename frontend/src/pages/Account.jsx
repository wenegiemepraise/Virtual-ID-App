import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, User, Settings, LogOut, Plus, Eye, Download, Trash2, Edit, Camera, CreditCard, FileText, AlertCircle, QrCode, Activity } from 'lucide-react';
import QRGenerator from '../components/QRGenerator';

const Account = () => {
    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('documents');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Fetch user's documents
        fetchUserDocuments(userData.id);
    }, [navigate]);

    const fetchUserDocuments = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/get-ids/${userId}`);
            const data = await response.json();

            if (response.ok) {
                setDocuments(data.ids.map(doc => ({
                    id: doc.id,
                    name: doc.id_type,
                    type: doc.id_type,
                    date: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Unknown',
                    status: 'Active',
                    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
                    id_number: doc.id_number,
                    user_id: userId
                })));
            } else {
                setError('Failed to load documents');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'documents':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
                            <Link to="/scan-id">
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Document
                                </Button>
                            </Link>
                        </div>

                        {documents.length === 0 ? (
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-12 text-center">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
                                    <p className="text-gray-600 mb-6">Start by scanning your first ID document</p>
                                    <Link to="/scan-id">
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                            <Camera className="w-5 h-5 mr-2" />
                                            Scan Your First Document
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documents.map((doc) => (
                                    <Card key={doc.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                        <CardContent className="p-0">
                                            <div className="relative">
                                                <img 
                                                    src={doc.image} 
                                                    alt={doc.name}
                                                    className="w-full h-48 object-cover rounded-t-lg"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                                                    <div className="flex items-center space-x-1">
                                                        {doc.type === 'Driver License' && <CreditCard className="w-4 h-4 text-blue-500" />}
                                                        {doc.type === 'Passport' && <FileText className="w-4 h-4 text-green-500" />}
                                                        {doc.type === 'Insurance' && <Shield className="w-4 h-4 text-purple-500" />}
                                                        {doc.type === 'Student ID' && <User className="w-4 h-4 text-purple-500" />}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{doc.type} • Added {doc.date}</p>
                                                <p className="text-xs text-gray-500 mb-4">ID: {doc.id_number}</p>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'qr-generator':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">QR Code Generator</h2>
                            <p className="text-gray-600">Generate QR codes for your virtual IDs</p>
                        </div>
                        
                        {documents.length > 0 ? (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <QrCode className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">How to Use Your Virtual ID</p>
                                            <p className="text-sm text-blue-700">
                                                Generate a QR code for any of your stored IDs. You can then show this QR code at places like libraries, 
                                                gyms, or anywhere that requires ID verification. The QR code contains encrypted data that only authorized 
                                                scanners can read.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Show QR Generator for first document */}
                                <QRGenerator idInfo={documents[0]} />
                            </div>
                        ) : (
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-12 text-center">
                                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Available</h3>
                                    <p className="text-gray-600 mb-6">You need to scan a document first to generate QR codes</p>
                                    <Link to="/scan-id">
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                            <Camera className="w-5 h-5 mr-2" />
                                            Scan Your First Document
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                );

            case 'quick-actions':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <CardContent className="p-8">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-4">Scan New Document</h3>
                                        <p className="text-blue-100 mb-6">
                                            Add your physical IDs to your digital vault
                                        </p>
                                        <Link to="/scan-id">
                                            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                                                <Camera className="w-5 h-5 mr-2" />
                                                Start Scanning
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-blue-600 text-white">
                                <CardContent className="p-8">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-4">Verify Virtual ID</h3>
                                        <p className="text-green-100 mb-6">
                                            Scan and verify virtual ID QR codes
                                        </p>
                                        <Link to="/verify-id">
                                            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                                                <QrCode className="w-5 h-5 mr-2" />
                                                Start Verification
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Camera className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Document Scanned</p>
                                            <p className="text-xs text-gray-600">Student ID added to your vault</p>
                                        </div>
                                        <span className="text-xs text-gray-500">2 hours ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <QrCode className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">QR Code Generated</p>
                                            <p className="text-xs text-gray-600">Virtual ID QR code created</p>
                                        </div>
                                        <span className="text-xs text-gray-500">1 day ago</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your account...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                VirtualID
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                            <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                {/* User Profile Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <Card className="md:col-span-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.username}</h2>
                                <p className="text-gray-600 mb-4">User ID: {user?.id}</p>
                                <div className="flex justify-center space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Cards */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{documents.length}</h3>
                                <p className="text-gray-600">Total Documents</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">100%</h3>
                                <p className="text-gray-600">Security Score</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <QrCode className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{documents.length}</h3>
                                <p className="text-gray-600">QR Codes Available</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('documents')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'documents'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <FileText className="w-4 h-4 inline mr-2" />
                                Documents
                            </button>
                            <button
                                onClick={() => setActiveTab('qr-generator')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'qr-generator'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <QrCode className="w-4 h-4 inline mr-2" />
                                QR Generator
                            </button>
                            <button
                                onClick={() => setActiveTab('quick-actions')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'quick-actions'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Activity className="w-4 h-4 inline mr-2" />
                                Quick Actions
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Account;