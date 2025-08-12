import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Camera, Upload, ArrowLeft, CheckCircle, AlertCircle, FileText, Shield, Save, QrCode, RotateCcw, Download, AlertTriangle, Smartphone } from 'lucide-react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { Html5QrcodeScanner } from 'html5-qrcode';

const IDScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [scanMode, setScanMode] = useState('camera'); // 'camera', 'qr', 'upload'
    const [cameraActive, setCameraActive] = useState(false);
    const [qrScanner, setQrScanner] = useState(null);
    const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
    const [isMobile, setIsMobile] = useState(false);
    
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const qrContainerRef = useRef(null);
    const navigate = useNavigate();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Add mobile-specific features
    const [showMobileGuide, setShowMobileGuide] = useState(false);
    
    // Show mobile guide on first visit
    useEffect(() => {
        if (isMobile && !localStorage.getItem('mobileGuideShown')) {
            setShowMobileGuide(true);
            localStorage.setItem('mobileGuideShown', 'true');
        }
    }, [isMobile]);

    // Camera constraints for better document scanning
    const videoConstraints = {
        width: { ideal: isMobile ? 1280 : 1920 },
        height: { ideal: isMobile ? 720 : 1080 },
        facingMode: 'environment', // Use back camera on mobile
        focusMode: 'continuous'
    };

    // Check camera permissions
    const checkCameraPermission = async () => {
        try {
            if (navigator.permissions && navigator.permissions.query) {
                const permission = await navigator.permissions.query({ name: 'camera' });
                setCameraPermission(permission.state);
                
                permission.onchange = () => {
                    setCameraPermission(permission.state);
                };
            }
        } catch (error) {
            console.log('Permission API not supported');
        }
    };

    useEffect(() => {
        checkCameraPermission();
    }, []);

    // Initialize QR Scanner
    useEffect(() => {
        if (scanMode === 'qr' && qrContainerRef.current && !qrScanner) {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { 
                    fps: 10, 
                    qrbox: { width: isMobile ? 200 : 250, height: isMobile ? 200 : 250 },
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
        }

        return () => {
            if (qrScanner) {
                qrScanner.clear();
                setQrScanner(null);
            }
        };
    }, [scanMode, qrScanner, isMobile]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (qrScanner) {
                qrScanner.clear();
            }
        };
    }, [qrScanner]);

    const startCamera = async () => {
        try {
            setError('');
            setCameraActive(true);
            setScanMode('camera');
            
            // Request camera permission if not granted
            if (cameraPermission === 'prompt') {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
                setCameraPermission('granted');
            }
        } catch (error) {
            console.error('Camera error:', error);
            if (error.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera permissions and try again.');
                setCameraPermission('denied');
            } else if (error.name === 'NotFoundError') {
                setError('No camera found on this device.');
            } else {
                setError('Failed to start camera. Please try again.');
            }
            setCameraActive(false);
        }
    };

    const stopCamera = () => {
        setCameraActive(false);
        setScanMode('camera');
    };

    const captureImage = useCallback(() => {
        if (webcamRef.current) {
            try {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    setCapturedImage(imageSrc);
                    setCameraActive(false);
                    processImage(imageSrc);
                } else {
                    setError('Failed to capture image. Please try again.');
                }
            } catch (error) {
                console.error('Capture error:', error);
                setError('Failed to capture image. Please try again.');
            }
        }
    }, []);

    const processImage = async (imageData) => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // Show processing message
            setSuccess('Processing image... This may take a few seconds.');
            
            // Use Tesseract.js for OCR text extraction
            const result = await Tesseract.recognize(
                imageData,
                'eng', // English language
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setSuccess(`Processing... ${Math.round(m.progress * 100)}%`);
                        } else if (m.status === 'loading tesseract core') {
                            setSuccess('Loading OCR engine...');
                        } else if (m.status === 'initializing tesseract') {
                            setSuccess('Initializing text recognition...');
                        }
                    }
                }
            );

            // Extract common ID fields using regex patterns
            const extractedText = result.data.text;
            const extractedData = extractIDData(extractedText);
            
            // Check if we extracted meaningful data
            const hasValidData = extractedData.name || extractedData.idNumber || extractedData.institution;
            
            if (!hasValidData) {
                setError('Could not extract clear information from the image. Please try with a clearer, better-lit image.');
                setLoading(false);
                return;
            }
            
            setScanResult({
                success: true,
                documentType: extractedData.documentType || 'Unknown Document',
                confidence: Math.round(result.data.confidence || 85), // OCR confidence
                data: extractedData,
                rawText: extractedText,
                imageData: imageData
            });
            
            setSuccess('Document processed successfully!');
            
        } catch (error) {
            console.error('OCR Error:', error);
            if (error.message.includes('timeout')) {
                setError('Processing timed out. Please try with a smaller or clearer image.');
            } else {
                setError('Failed to process image. Please try again with a clearer image.');
            }
        } finally {
            setLoading(false);
        }
    };

    const extractIDData = (text) => {
        const data = {};
        
        // Extract name (common patterns)
        const namePatterns = [
            /name[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/,
            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:university|college|school)/i
        ];
        
        for (const pattern of namePatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                data.name = match[1].trim();
                break;
            }
        }

        // Extract ID number
        const idPatterns = [
            /(?:id|student\s*id|number)[:\s]+([A-Z0-9]{6,12})/i,
            /([A-Z0-9]{6,12})/,
            /(?:#[:\s]+)([A-Z0-9]{6,12})/i
        ];
        
        for (const pattern of idPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                data.idNumber = match[1].trim();
                break;
            }
        }

        // Extract expiry date
        const datePatterns = [
            /(?:exp|expiry|valid)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
            /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
            /(?:valid\s+until|expires)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
        ];
        
        for (const pattern of datePatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                data.expiryDate = match[1].trim();
                break;
            }
        }

        // Extract institution
        const institutionPatterns = [
            /(?:university|college|school)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:university|college|school)/i
        ];
        
        for (const pattern of institutionPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                data.institution = match[1].trim();
                break;
            }
        }

        // Determine document type based on content
        if (text.toLowerCase().includes('student') || text.toLowerCase().includes('university') || text.toLowerCase().includes('college')) {
            data.documentType = 'Student ID';
        } else if (text.toLowerCase().includes('driver') || text.toLowerCase().includes('license')) {
            data.documentType = 'Driver License';
        } else if (text.toLowerCase().includes('passport')) {
            data.documentType = 'Passport';
        } else {
            data.documentType = 'ID Card';
        }

        return data;
    };

    const handleQRCodeScanned = (qrData) => {
        try {
            // Try to parse QR data as JSON
            const parsedData = JSON.parse(qrData);
            setScanResult({
                success: true,
                documentType: 'QR Code',
                confidence: 100,
                data: parsedData,
                rawText: qrData,
                imageData: null
            });
        } catch {
            // If not JSON, treat as plain text
            setScanResult({
                success: true,
                documentType: 'QR Code',
                confidence: 100,
                data: {
                    qrData: qrData,
                    documentType: 'QR Code'
                },
                rawText: qrData,
                imageData: null
            });
        }
        
        // Stop QR scanner
        if (qrScanner) {
            qrScanner.clear();
            setQrScanner(null);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Please select a valid image file (JPEG, PNG, or WebP).');
                return;
            }

            // Validate file size (10MB limit)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setError('File size must be less than 10MB. Please select a smaller image.');
                return;
            }

            setError('');
            setLoading(true);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                setCapturedImage(imageData);
                processImage(imageData);
            };
            reader.onerror = () => {
                setError('Failed to read file. Please try again.');
                setLoading(false);
            };
            reader.readAsDataURL(file);
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
            // Prepare document data for storage
            const documentData = {
                user_id: user.id,
                id_type: scanResult.data.documentType || scanResult.documentType,
                id_number: scanResult.data.idNumber || scanResult.data.qrData || 'Unknown',
                id_image: scanResult.imageData || '',
                raw_text: scanResult.rawText || '',
                extracted_data: JSON.stringify(scanResult.data)
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
                setSuccess('Document saved successfully! You can now use your virtual ID.');
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

    const resetScanner = () => {
        setScanResult(null);
        setCapturedImage(null);
        setCameraActive(false);
        setError('');
        setSuccess('');
        if (qrScanner) {
            qrScanner.clear();
            setQrScanner(null);
        }
    };

    const downloadImage = () => {
        if (capturedImage) {
            const link = document.createElement('a');
            link.href = capturedImage;
            link.download = 'scanned-document.png';
            link.click();
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
                            Smart Document Scanner
                        </h1>
                        <p className="text-xl text-gray-600">
                            Scan your physical IDs and create secure virtual copies for easy access
                        </p>
                    </div>

                    {!scanResult ? (
                        <div className="space-y-6">
                            {/* Success/Error Notifications */}
                            {success && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-green-700 text-sm">{success}</span>
                                </div>
                            )}
                            
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <span className="text-red-700 text-sm">{error}</span>
                                </div>
                            )}
                            
                            {/* Scan Mode Selection */}
                            <div className="flex justify-center space-x-2 sm:space-x-4 mb-6">
                                <Button
                                    onClick={() => setScanMode('camera')}
                                    variant={scanMode === 'camera' ? 'default' : 'outline'}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base px-3 sm:px-4"
                                >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Camera
                                </Button>
                                <Button
                                    onClick={() => setScanMode('qr')}
                                    variant={scanMode === 'qr' ? 'default' : 'outline'}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base px-3 sm:px-4"
                                >
                                    <QrCode className="w-4 h-4 mr-2" />
                                    QR Code
                                </Button>
                                <Button
                                    onClick={() => setScanMode('upload')}
                                    variant={scanMode === 'upload' ? 'default' : 'outline'}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base px-3 sm:px-4"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload
                                </Button>
                            </div>

                            {/* Camera Scanner */}
                            {scanMode === 'camera' && (
                                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">Camera Scanner</CardTitle>
                                                <CardDescription>Use your device camera to scan documents</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Camera Permission Error */}
                                            {cameraPermission === 'denied' && (
                                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                                        <span className="text-red-700 font-medium">Camera Access Denied</span>
                                                    </div>
                                                    <p className="text-red-600 text-sm mb-3">
                                                        Please enable camera permissions in your browser settings to use the scanner.
                                                    </p>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => window.location.reload()}
                                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                                    >
                                                        Refresh Page
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Mobile Tips */}
                                            {isMobile && (
                                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Smartphone className="w-5 h-5 text-blue-500" />
                                                        <span className="text-blue-700 font-medium">Mobile Tips</span>
                                                    </div>
                                                    <ul className="text-blue-600 text-sm space-y-1">
                                                        <li>• Hold your device steady while scanning</li>
                                                        <li>• Ensure good lighting and avoid shadows</li>
                                                        <li>• Keep the document within the frame</li>
                                                    </ul>
                                                </div>
                                            )}

                                            {cameraActive ? (
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <Webcam
                                                            ref={webcamRef}
                                                            audio={false}
                                                            screenshotFormat="image/jpeg"
                                                            videoConstraints={videoConstraints}
                                                            className="w-full rounded-lg"
                                                            onUserMediaError={(error) => {
                                                                console.error('Webcam error:', error);
                                                                setError('Failed to access camera. Please check permissions.');
                                                                setCameraActive(false);
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 border-2 border-blue-500 border-dashed rounded-lg pointer-events-none">
                                                            <div className="absolute top-2 left-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                                                Position document here
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Camera Overlay Instructions */}
                                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                                                            {isMobile ? 'Tap capture when ready' : 'Click capture when ready'}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <Button 
                                                            onClick={captureImage}
                                                            disabled={loading}
                                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 disabled:opacity-50"
                                                        >
                                                            {loading ? (
                                                                <div className="flex items-center">
                                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                                    Processing...
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <Camera className="w-5 h-5 mr-2" />
                                                                    Capture Image
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            onClick={stopCamera}
                                                            disabled={loading}
                                                            className="h-12 disabled:opacity-50"
                                                        >
                                                            <RotateCcw className="w-5 h-5 mr-2" />
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                                                        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-600 mb-4">Ready to scan your document</p>
                                                        <p className="text-sm text-gray-500">Ensure good lighting and place document on a flat surface</p>
                                                    </div>
                                                    <Button 
                                                        onClick={startCamera}
                                                        disabled={cameraPermission === 'denied'}
                                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Camera className="w-5 h-5 mr-2" />
                                                        {cameraPermission === 'denied' ? 'Camera Blocked' : 'Start Camera'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* QR Code Scanner */}
                            {scanMode === 'qr' && (
                                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <QrCode className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">QR Code Scanner</CardTitle>
                                                <CardDescription>Scan QR codes to quickly add documents</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {!qrScanner ? (
                                                <div className="bg-gray-100 rounded-lg p-8 text-center">
                                                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                    <p className="text-gray-600 mb-2">Initializing QR Scanner...</p>
                                                    <p className="text-sm text-gray-500">Please wait while we set up the camera</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div id="qr-reader" ref={qrContainerRef} className="w-full"></div>
                                                    <p className="text-sm text-gray-600 text-center">
                                                        Point your camera at a QR code to scan
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* File Upload */}
                            {scanMode === 'upload' && (
                                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
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
                                            {/* File Upload Area */}
                                            <div 
                                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                                                    loading 
                                                        ? 'border-blue-300 bg-blue-50' 
                                                        : 'border-gray-300 hover:border-blue-500'
                                                }`}
                                                onClick={() => !loading && fileInputRef.current?.click()}
                                            >
                                                {loading ? (
                                                    <div className="space-y-4">
                                                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                                        <p className="text-blue-600 font-medium">Processing image...</p>
                                                        <p className="text-sm text-blue-500">Please wait while we extract information</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                                        <p className="text-sm text-gray-500">PNG, JPG, JPEG, WebP up to 10MB</p>
                                                    </>
                                                )}
                                            </div>
                                            
                                            {/* File Input */}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                disabled={loading}
                                            />
                                            
                                            {/* Upload Button */}
                                            <Button 
                                                variant="outline" 
                                                onClick={() => !loading && fileInputRef.current?.click()}
                                                disabled={loading}
                                                className="w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Upload className="w-5 h-5 mr-2" />
                                                {loading ? 'Processing...' : 'Choose File'}
                                            </Button>
                                            
                                            {/* File Requirements */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-medium text-gray-900 mb-2">File Requirements:</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>• Supported formats: JPEG, PNG, WebP</li>
                                                    <li>• Maximum file size: 10MB</li>
                                                    <li>• Ensure text is clearly visible and readable</li>
                                                    <li>• Good lighting and contrast recommended</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
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

                                    {/* Captured Image Preview */}
                                    {capturedImage && (
                                        <div className="bg-gray-100 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-900 mb-4">Captured Image</h3>
                                            <div className="relative">
                                                <img 
                                                    src={capturedImage} 
                                                    alt="Captured document" 
                                                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                                                />
                                                <Button
                                                    onClick={downloadImage}
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Document Information */}
                                    <div className="bg-gray-100 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">Extracted Information</h3>
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
                                                    Save to Virtual ID Vault
                                                </>
                                            )}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={resetScanner}
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
                                                    Your document is processed with advanced OCR technology and stored securely in your digital vault. 
                                                    You can now use your virtual ID anywhere you need to present identification.
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
                            <h3 className="font-semibold text-gray-900 mb-4">Scanning Tips for Best Results</h3>
                            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <p>Ensure good lighting and place document on a flat, dark surface</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <p>Keep the document within the camera frame and avoid shadows or glare</p>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <p>Make sure all text is clearly visible and readable</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mobile Guide Modal */}
                    {showMobileGuide && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <div className="text-center mb-6">
                                    <Smartphone className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Virtual ID!</h3>
                                    <p className="text-gray-600">Get the best experience on your mobile device</p>
                                </div>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-600 text-sm font-bold">1</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Hold Steady</p>
                                            <p className="text-sm text-gray-600">Keep your device steady while scanning documents</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-600 text-sm font-bold">2</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Good Lighting</p>
                                            <p className="text-sm text-gray-600">Ensure bright, even lighting for best results</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-600 text-sm font-bold">3</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Position Document</p>
                                            <p className="text-sm text-gray-600">Place document on a dark, flat surface</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <Button 
                                    onClick={() => setShowMobileGuide(false)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    Got it!
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Mobile Floating Action Button */}
                    {isMobile && (
                        <div className="fixed bottom-6 right-6 z-40">
                            <Button
                                onClick={() => setShowMobileGuide(true)}
                                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                                size="lg"
                            >
                                <Smartphone className="w-6 h-6" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IDScanner;