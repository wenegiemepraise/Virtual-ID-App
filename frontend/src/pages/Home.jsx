import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Smartphone, Zap, ArrowRight, Camera, User, Lock } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-4">
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
                        <Link to="/register">
                            <Button variant="ghost" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:text-gray-900">
                                Sign Up
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-gray-900">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Your Digital Identity
                        <br />
                        <span className="text-gray-900">Reimagined</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Store your physical IDs securely in the digital realm. Access them anytime, anywhere with military-grade encryption and seamless convenience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/scan-id">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                                <Camera className="w-5 h-5 mr-2" />
                                Scan Your ID
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle className="text-xl">Bank-Level Security</CardTitle>
                            <CardDescription>
                                Military-grade encryption ensures your data is protected with the highest security standards.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle className="text-xl">Always Accessible</CardTitle>
                            <CardDescription>
                                Access your IDs from any device, anywhere in the world with instant synchronization.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle className="text-xl">Lightning Fast</CardTitle>
                            <CardDescription>
                                Instant access to your documents with optimized performance and minimal loading times.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-6 py-16">
                <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <CardContent className="p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Go Digital?</h2>
                        <p className="text-blue-100 mb-8 text-lg">
                            Join thousands of users who trust VirtualID for their digital identity management.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                                    <User className="w-5 h-5 mr-2" />
                                    Create Account
                                </Button>
                            </Link>
                            <Link to="/account">
                                <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                                    <Lock className="w-5 h-5 mr-2" />
                                    View My IDs
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-8 border-t border-gray-200">
                <div className="text-center text-gray-600">
                    <p>&copy; 2024 VirtualID. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;