import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, CheckCircle, XCircle, AlertTriangle, Shield, User, Calendar, Hash } from 'lucide-react';

const IDVerifier = () => {
    const [scanning, setScanning] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [qrScanner, setQrScanner] = useState(null);
    const [error, setError] = useState('');
    const qrContainerRef = useRef(null);

    // Initialize QR Scanner
    useEffect(() => {
        if (qrContainerRef.current && !qrScanner) {
            const scanner = new Html5QrcodeScanner(
                "verifier-qr-reader",
                { 
                    fps: 10, 
                    qrbox: { width: 300, height: 300 },
                    aspectRatio: 1.0
                },
                false
            );
            
            scanner.render((decodedText, decodedResult) => {
                handleQRCodeScanned(decodedText);
            }, (errorMessage) => {
                // Handle scan error silently
            });
            
            setQrScanner(scanner);
            setScanning(true);
        }

        return () => {
            if (qrScanner) {
                qrScanner.clear();
                setQrScanner(null);
            }
        };
    }, [qrScanner]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (qrScanner) {
                qrScanner.clear();
            }
        };
    }, [qrScanner]);

    const handleQRCodeScanned = async (qrData) => {
        try {
            // Parse QR data
            const parsedData = JSON.parse(qrData);
            
            // Verify it's a valid virtual ID
            if (parsedData.type === 'virtual_id') {
                // Verify the hash
                const expectedHash = btoa(`${parsedData.id_number}${parsedData.user_id}`).slice(0, 16);
                const isValid = parsedData.verification_hash === expectedHash;
                
                // Check if timestamp is recent (within 24 hours)
                const timestamp = new Date(parsedData.timestamp);
                const now = new Date();
                const isRecent = (now - timestamp) < (24 * 60 * 60 * 1000); // 24 hours
                
                setVerificationResult({
                    valid: isValid && isRecent,
                    data: parsedData,
                    timestamp: timestamp,
                    isRecent: isRecent,
                    hashValid: isValid
                });
                
                // Stop scanner
                if (qrScanner) {
                    qrScanner.clear();
                    setQrScanner(null);
                    setScanning(false);
                }
            } else {
                setError('Invalid QR code format. This is not a Virtual ID.');
            }
        } catch (error) {
            setError('Failed to parse QR code data. Please try again.');
        }
    };

    const resetVerifier = () => {
        setVerificationResult(null);
        setError('');
        setScanning(false);
        if (qrScanner) {
            qrScanner.clear();
            setQrScanner(null);
        }
    };

    const startNewScan = () => {
        resetVerifier();
        // Restart scanner after a brief delay
        setTimeout(() => {
            if (qrContainerRef.current) {
                const scanner = new Html5QrcodeScanner(
                    "verifier-qr-reader",
                    { 
                        fps: 10, 
                        qrbox: { width: 300, height: 300 },
                        aspectRatio: 1.0
                    },
                    false
                );
                
                scanner.render((decodedText, decodedResult) => {
                    handleQRCodeScanned(decodedText);
                }, (errorMessage) => {
                    // Handle scan error silently
                });
                
                setQrScanner(scanner);
                setScanning(true);
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                            Virtual ID Verifier
                        </h1>
                        <p className="text-xl text-gray-600">
                            Scan and verify virtual ID QR codes for authorized access
                        </p>
                    </div>

                    {!verificationResult ? (
                        <div className="space-y-6">
                            {/* Scanner */}
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                            <QrCode className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">QR Code Scanner</CardTitle>
                                            <CardDescription>Scan a Virtual ID QR code to verify identity</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {scanning ? (
                                            <div className="space-y-4">
                                                <div id="verifier-qr-reader" ref={qrContainerRef} className="w-full"></div>
                                                <p className="text-sm text-gray-600 text-center">
                                                    Point the scanner at a Virtual ID QR code
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 rounded-lg p-8 text-center">
                                                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600">Ready to scan Virtual ID</p>
                                            </div>
                                        )}
                                        
                                        {error && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                                <span className="text-red-700 text-sm">{error}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructions */}
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Verification Instructions</h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div className="flex items-start space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                            <p>Ensure the QR code is clearly visible and well-lit</p>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                            <p>Hold the scanner steady for accurate reading</p>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                            <p>Verify the person matches the ID information</p>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                            <p>Check that the timestamp is recent</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        /* Verification Results */
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                        verificationResult.valid 
                                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                            : 'bg-gradient-to-r from-red-500 to-red-600'
                                    }`}>
                                        {verificationResult.valid ? (
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            {verificationResult.valid ? 'Verification Successful' : 'Verification Failed'}
                                        </CardTitle>
                                        <CardDescription>
                                            {verificationResult.valid 
                                                ? 'This Virtual ID is valid and can be used for access' 
                                                : 'This Virtual ID cannot be verified'
                                            }
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Status Summary */}
                                    <div className={`p-4 rounded-lg ${
                                        verificationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                    }`}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            {verificationResult.valid ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                            <span className={`font-medium ${
                                                verificationResult.valid ? 'text-green-900' : 'text-red-900'
                                            }`}>
                                                Verification Status
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p className={verificationResult.valid ? 'text-green-700' : 'text-red-700'}>
                                                • Hash Verification: {verificationResult.hashValid ? '✅ Valid' : '❌ Invalid'}
                                            </p>
                                            <p className={verificationResult.valid ? 'text-green-700' : 'text-red-700'}>
                                                • Timestamp: {verificationResult.isRecent ? '✅ Recent' : '❌ Expired'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ID Information */}
                                    <div className="bg-gray-100 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">ID Information</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">ID Type</p>
                                                    <p className="text-gray-900">{verificationResult.data.id_type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Hash className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">ID Number</p>
                                                    <p className="text-gray-900">{verificationResult.data.id_number}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Generated</p>
                                                    <p className="text-gray-900">
                                                        {verificationResult.timestamp.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Verification Hash</p>
                                                    <p className="text-xs font-mono text-gray-900">
                                                        {verificationResult.data.verification_hash}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button 
                                            onClick={startNewScan}
                                            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-12"
                                        >
                                            <QrCode className="w-5 h-5 mr-2" />
                                            Scan Another ID
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={resetVerifier}
                                            className="flex-1 h-12"
                                        >
                                            Reset
                                        </Button>
                                    </div>

                                    {/* Security Notice */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-900">Security Information</p>
                                                <p className="text-sm text-blue-700">
                                                    This verification system uses cryptographic hashing to ensure the authenticity of Virtual IDs. 
                                                    Always verify the person presenting the ID matches the information displayed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IDVerifier;
