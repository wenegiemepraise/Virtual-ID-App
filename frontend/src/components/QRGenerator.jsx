import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Download, QrCode, Copy, CheckCircle } from 'lucide-react';

const QRGenerator = ({ idInfo }) => {
    const [qrData, setQrData] = useState('');
    const [copied, setCopied] = useState(false);
    const [customData, setCustomData] = useState('');

    // Generate QR data from ID info
    const generateQRData = () => {
        if (idInfo) {
            const data = {
                type: 'virtual_id',
                id_type: idInfo.id_type,
                id_number: idInfo.id_number,
                user_id: idInfo.user_id,
                timestamp: new Date().toISOString(),
                verification_hash: btoa(`${idInfo.id_number}${idInfo.user_id}`).slice(0, 16)
            };
            setQrData(JSON.stringify(data));
        }
    };

    // Copy QR data to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(qrData);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Download QR code as SVG
    const downloadQR = () => {
        const svg = document.querySelector('#qr-code svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL('image/png');
                
                const downloadLink = document.createElement('a');
                downloadLink.download = `virtual-id-${idInfo?.id_number || 'qr'}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    // Generate QR from custom data
    const generateCustomQR = () => {
        if (customData.trim()) {
            setQrData(customData);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">QR Code Generator</CardTitle>
                            <CardDescription>Generate QR codes for your virtual IDs</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Auto-generate from ID Info */}
                        {idInfo && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Generate from Virtual ID</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">ID Type:</span>
                                            <p className="text-gray-900">{idInfo.id_type}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">ID Number:</span>
                                            <p className="text-gray-900">{idInfo.id_number}</p>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    onClick={generateQRData}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12"
                                >
                                    <QrCode className="w-5 h-5 mr-2" />
                                    Generate QR Code
                                </Button>
                            </div>
                        )}

                        {/* Custom QR Code */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Custom QR Code</h3>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Enter custom text or data for QR code"
                                    value={customData}
                                    onChange={(e) => setCustomData(e.target.value)}
                                    className="flex-1"
                                />
                                <Button 
                                    onClick={generateCustomQR}
                                    variant="outline"
                                    className="px-6"
                                >
                                    Generate
                                </Button>
                            </div>
                        </div>

                        {/* QR Code Display */}
                        {qrData && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Generated QR Code</h3>
                                <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                                    <div id="qr-code" className="flex justify-center mb-4">
                                        <QRCodeSVG
                                            value={qrData}
                                            size={200}
                                            level="M"
                                            includeMargin={true}
                                            className="border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    
                                    {/* QR Data Preview */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <p className="text-xs text-gray-600 mb-2">QR Code Data:</p>
                                        <p className="text-xs font-mono text-gray-800 break-all">
                                            {qrData.length > 100 ? `${qrData.substring(0, 100)}...` : qrData}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3">
                                        <Button
                                            onClick={copyToClipboard}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy Data
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={downloadQR}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Usage Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">How to Use Your Virtual ID QR Code</h4>
                            <div className="space-y-2 text-sm text-blue-700">
                                <p>• <strong>At the Library:</strong> Show this QR code to the librarian - they can scan it to verify your identity</p>
                                <p>• <strong>Security:</strong> Your QR code contains encrypted data that only authorized scanners can read</p>
                                <p>• <strong>Convenience:</strong> No need to carry physical IDs - just use your phone!</p>
                                <p>• <strong>Backup:</strong> Download the QR code image as a backup in case your phone is unavailable</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QRGenerator;
