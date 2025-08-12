# Virtual ID App - Frontend

This is the frontend part of the Virtual ID application, built using React, Tailwind CSS, and other modern web technologies. The application allows users to create accounts and securely store their physical IDs virtually.

## Features

### 🆔 ID Scanner Component
The ID Scanner is a comprehensive document scanning solution that supports multiple input methods:

#### 📷 Camera Scanner
- **Real-time camera access** with high-resolution capture
- **Mobile-optimized** with responsive design
- **Permission handling** with user-friendly error messages
- **Document positioning guide** with visual overlay
- **Progress indicators** during processing

#### 📱 QR Code Scanner
- **HTML5 QR Code scanning** using device camera
- **Real-time detection** with instant feedback
- **Mobile-friendly** interface
- **Automatic parsing** of QR data

#### 📁 File Upload
- **Drag & drop** support for easy file selection
- **Multiple format support**: JPEG, PNG, WebP
- **File validation** with size limits (10MB max)
- **Progress tracking** during upload and processing

### 🔍 OCR Processing
- **Advanced text extraction** using Tesseract.js
- **Intelligent data parsing** with regex patterns
- **Multiple document types** support:
  - Student IDs
  - Driver Licenses
  - Passports
  - General ID Cards
- **Confidence scoring** for extracted data

### 🎯 Extracted Information
The scanner automatically extracts:
- **Name** from various text patterns
- **ID Number** with multiple format support
- **Expiry Date** in various date formats
- **Institution** for educational IDs
- **Document Type** auto-detection

### 🔒 Security Features
- **Secure storage** in user's digital vault
- **Local processing** - images processed client-side
- **User authentication** required for saving
- **Encrypted transmission** to backend

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser with camera support

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Usage

### 1. Camera Scanning
1. Click "Camera" mode
2. Allow camera permissions when prompted
3. Position your document within the frame
4. Click "Capture Image" when ready
5. Wait for OCR processing to complete
6. Review extracted information
7. Save to your virtual ID vault

### 2. QR Code Scanning
1. Click "QR Code" mode
2. Wait for scanner initialization
3. Point camera at QR code
4. Information is automatically extracted
5. Save to your virtual ID vault

### 3. File Upload
1. Click "Upload" mode
2. Drag & drop or click to select file
3. Ensure file meets requirements:
   - Supported formats: JPEG, PNG, WebP
   - Maximum size: 10MB
   - Clear, readable text
4. Wait for processing to complete
5. Review and save extracted data

## Technical Details

### Dependencies
- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Tesseract.js** - OCR text recognition
- **React Webcam** - Camera integration
- **HTML5 QR Code** - QR scanning library
- **Lucide React** - Icon library

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Mobile Support
- iOS Safari 13+
- Chrome Mobile 80+
- Samsung Internet 10+

## Best Practices

### For Best Scanning Results
1. **Good Lighting**: Ensure document is well-lit
2. **Flat Surface**: Place document on dark, flat surface
3. **Steady Camera**: Keep device steady during capture
4. **Clear Text**: Ensure all text is readable
5. **Avoid Glare**: Minimize shadows and reflections

### File Requirements
- **Format**: JPEG, PNG, WebP
- **Size**: Maximum 10MB
- **Quality**: High resolution recommended
- **Content**: Clear, readable text

## Troubleshooting

### Camera Issues
- **Permission Denied**: Check browser settings
- **No Camera Found**: Ensure device has camera
- **Poor Quality**: Improve lighting and positioning

### Processing Issues
- **OCR Fails**: Try clearer image or better lighting
- **Timeout**: Use smaller image file
- **No Data Extracted**: Ensure text is clearly visible

### Mobile Issues
- **Camera Not Working**: Check app permissions
- **Poor Performance**: Close other apps
- **Orientation Issues**: Keep device steady

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

This project is licensed under the ISC License.