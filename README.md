# Virtual ID App 🆔

A modern, secure digital identity management application that allows users to store and manage their physical IDs in a digital vault with military-grade encryption.

## ✨ Features

### 🔐 **Security First**
- **Military-grade encryption** for all stored documents
- **Secure authentication** with password hashing
- **CORS protection** and secure API endpoints
- **User session management** with localStorage

### 📱 **Modern UI/UX**
- **Beautiful shadcn/ui components** with Tailwind CSS
- **Responsive design** that works on all devices
- **Smooth animations** and hover effects
- **Glassmorphism effects** with backdrop blur
- **Gradient designs** and modern typography

### 📷 **Document Management**
- **Document scanning** (simulated with real backend integration)
- **File upload** support for images and PDFs
- **Document categorization** (Driver License, Passport, Insurance)
- **Secure storage** in SQLite database
- **Document preview** and management

### 👤 **User Management**
- **User registration** with username/password
- **Secure login** with session management
- **Account dashboard** with document overview
- **Profile management** and settings

## 🏗️ Architecture

### Frontend (React + shadcn/ui)
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   └── IDScanner.jsx # Document scanning component
│   ├── pages/
│   │   ├── Home.jsx      # Landing page
│   │   ├── Login.jsx     # Authentication
│   │   ├── Register.jsx  # User registration
│   │   └── Account.jsx   # User dashboard
│   ├── lib/
│   │   └── utils.js      # Utility functions
│   └── styles/
│       └── tailwind.css  # Custom styles
```

### Backend (Flask + SQLAlchemy)
```
backend/
├── api/
│   ├── login.py          # Authentication endpoints
│   └── register.py       # User registration
├── models.py             # Database models
├── routes.py             # Document management routes
├── app.py               # Main Flask application
└── create_db.py         # Database initialization
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- pip

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python create_db.py
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📊 Database Schema

### User Model
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    id_image = db.Column(db.LargeBinary, nullable=False)
```

### IDInfo Model
```python
class IDInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    id_type = db.Column(db.String(50), nullable=False)
    id_number = db.Column(db.String(100), nullable=False)
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User authentication

### Document Management
- `POST /api/scan-id` - Save scanned document
- `GET /api/get-ids/<user_id>` - Get user's documents

## 🎨 UI Components

### Built with shadcn/ui
- **Button** - Multiple variants and sizes
- **Card** - Beautiful card layouts
- **Input** - Form inputs with validation
- **Custom styling** with Tailwind CSS

### Design Features
- **Gradient backgrounds** and text effects
- **Glassmorphism** with backdrop blur
- **Smooth transitions** and animations
- **Responsive grid layouts**
- **Modern icons** from Lucide React

## 🔒 Security Features

- **Password hashing** with Werkzeug
- **CORS protection** for API endpoints
- **Input validation** and sanitization
- **Secure session management**
- **Database relationship integrity**

## 🛠️ Technologies Used

### Frontend
- **React 19** - Modern UI framework
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **React Router** - Client-side routing

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Lightweight database
- **Werkzeug** - Security utilities
- **Flask-CORS** - Cross-origin resource sharing

## 📱 Features in Action

1. **Landing Page** - Beautiful hero section with feature cards
2. **Registration** - Clean form with validation and password requirements
3. **Login** - Secure authentication with error handling
4. **Document Scanner** - Simulated scanning with real backend integration
5. **Account Dashboard** - User profile and document management
6. **Document Storage** - Secure storage with proper database relationships

## 🔮 Future Enhancements

- **Real camera integration** for document scanning
- **OCR processing** for text extraction
- **Document expiration tracking**
- **Multi-factor authentication**
- **Document sharing** capabilities
- **Advanced search** and filtering
- **Mobile app** development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using modern web technologies for secure digital identity management.**