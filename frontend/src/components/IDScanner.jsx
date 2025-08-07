import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Camera, Upload, ArrowLeft, CheckCircle, AlertCircle, FileText, Shield, Save } from 'lucide-react';

const IDScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const startScanning = () => {
        setScanning(true);
        // Simulate camera access
        setTimeout(() => {
            setScanning(false);
            setScanResult({
                success: true,
                documentType: 'Driver License',
                confidence: 95,
                data: {
                    name: 'John Doe',
                    licenseNumber: 'DL123456789',
                    expiryDate: '2025-12-31',
                    state: 'California'
                }
            });
        }, 3000);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            // Simulate processing
            setTimeout(() => {
                setScanResult({
                    success: true,
                    documentType: 'Passport',
                    confidence: 92,
                    data: {
                        name: 'John Doe',
                        passportNumber: 'P123456789',
                        expiryDate: '2028-06-15',
                        nationality: 'United States'
                    }
                });
            }, 2000);
        }
    };

    const handleSave = async () => {
        if (!user.id) {
            setError('Please login first');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Convert scan result to base64 for storage
            const documentData = {
                user_id: user.id,
                id_type: scanResult.documentType,
                id_number: scanResult.data.licenseNumber || scanResult.data.passportNumber,
                // In a real app, you'd save the actual image data
                id_image: btoa('simulated_image_data') // Base64 encoded image
            };

            const response = await fetch('http://localhost:5000/api/scan-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(documentData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Document saved successfully!');
                setTimeout(() => {
                    navigate('/account');
                }, 2000);
            } else {
                setError(data.message || 'Failed to save document');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Home</span>
                        </Link>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                VirtualID
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            Document Scanner
                        </h1>
                        <p className="text-xl text-gray-600">
                            Scan your physical IDs and store them securely in your digital vault
                        </p>
                    </div>

                    {!scanResult ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Camera Scanner */}
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">Camera Scan</CardTitle>
                                            <CardDescription>Use your device camera to scan documents</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                                            {scanning ? (
                                                <div className="space-y-4">
                                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                                    <p className="text-gray-600">Scanning document...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                                                    <p className="text-gray-600">Position your document in the camera view</p>
                                                </div>
                                            )}
                                        </div>
                                        <Button 
                                            onClick={startScanning}
                                            disabled={scanning}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
                                        >
                                            <Camera className="w-5 h-5 mr-2" />
                                            {scanning ? 'Scanning...' : 'Start Camera Scan'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* File Upload */}
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">File Upload</CardTitle>
                                            <CardDescription>Upload an image of your document</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div 
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {uploadedFile ? (
                                                <div className="space-y-4">
                                                    <FileText className="w-16 h-16 text-blue-500 mx-auto" />
                                                    <p className="text-gray-900 font-medium">{uploadedFile.name}</p>
                                                    <p className="text-sm text-gray-600">Processing...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                                                    <p className="text-gray-600">Click to upload or drag and drop</p>
                                                    <p className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <Button 
                                            variant="outline" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-12"
                                        >
                                            <Upload className="w-5 h-5 mr-2" />
                                            Choose File
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        /* Scan Results */
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Scan Complete</CardTitle>
                                        <CardDescription>
                                            {scanResult.documentType} detected with {scanResult.confidence}% confidence
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                            <span className="text-red-700 text-sm">{error}</span>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="text-green-700 text-sm">{success}</span>
                                        </div>
                                    )}

                                    {/* Document Preview */}
                                    <div className="bg-gray-100 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">Document Information</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {Object.entries(scanResult.data).map(([key, value]) => (
                                                <div key={key} className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-600 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </p>
                                                    <p className="text-gray-900">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button 
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Saving...
                                                </div>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5 mr-2" />
                                                    Save to Vault
                                                </>
                                            )}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setScanResult(null)}
                                            className="flex-1 h-12"
                                        >
                                            <Camera className="w-5 h-5 mr-2" />
                                            Scan Another
                                        </Button>
                                    </div>

                                    {/* Security Notice */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-900">Secure Processing</p>
                                                <p className="text-sm text-blue-700">
                                                    Your document is processed with military-grade encryption and stored securely in your digital vault.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tips Section */}
                    <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Scanning Tips</h3>
                            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <p>Ensure good lighting and place document on a flat surface</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <p>Keep the document within the camera frame and avoid shadows</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <p>Make sure all text is clearly visible and readable</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default IDScanner;