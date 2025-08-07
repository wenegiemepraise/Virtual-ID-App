# Virtual ID App - Backend 🐍

A secure Flask-based backend API for the Virtual ID App, providing user authentication, document management, and secure data storage.

## 🏗️ Architecture

### Database Models
- **User Model**: Handles user authentication and profile data
- **IDInfo Model**: Stores document information with user relationships

### API Structure
- **Authentication Endpoints**: Registration and login
- **Document Management**: Scan, save, and retrieve documents
- **User Management**: Profile and session handling

## 📁 Project Structure

```
backend/
├── api/
│   ├── login.py          # Authentication endpoints
│   └── register.py       # User registration
├── models.py             # Database models (User, IDInfo)
├── routes.py             # Document management routes
├── app.py               # Main Flask application
├── create_db.py         # Database initialization
├── requirements.txt      # Python dependencies
└── instance/
    └── your_database.db # SQLite database file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation
```bash
cd backend
pip install -r requirements.txt
```

### Database Setup
```bash
python create_db.py
```

### Run the Application
```bash
python app.py
```

The server will start at `http://localhost:5000`

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
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate user |

### Document Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scan-id` | Save scanned document |
| GET | `/api/get-ids/<user_id>` | Get user's documents |

## 🔐 Security Features

- **Password Hashing**: Uses Werkzeug's `generate_password_hash` and `check_password_hash`
- **CORS Protection**: Configured for cross-origin requests
- **Input Validation**: All endpoints validate required fields
- **Database Relationships**: Proper foreign key constraints
- **Error Handling**: Comprehensive error responses

## 📝 API Documentation

### Register User
```http
POST /api/register
Content-Type: application/json

{
    "username": "john_doe",
    "password": "secure_password"
}
```

**Response:**
```json
{
    "message": "Account created successfully!"
}
```

### Login User
```http
POST /api/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "secure_password"
}
```

**Response:**
```json
{
    "message": "Login successful!",
    "user": {
        "id": 1,
        "username": "john_doe"
    }
}
```

### Save Document
```http
POST /api/scan-id
Content-Type: application/json

{
    "user_id": 1,
    "id_type": "Driver License",
    "id_number": "DL123456789"
}
```

**Response:**
```json
{
    "message": "ID scanned and saved successfully"
}
```

### Get User Documents
```http
GET /api/get-ids/1
```

**Response:**
```json
{
    "message": "Retrieved IDs successfully",
    "ids": [
        {
            "id": 1,
            "id_type": "Driver License",
            "id_number": "DL123456789"
        }
    ]
}
```

## 🛠️ Dependencies

### Core Dependencies
- **Flask**: Web framework
- **Flask-SQLAlchemy**: Database ORM
- **Flask-CORS**: Cross-origin resource sharing
- **Werkzeug**: Security utilities

### Development Dependencies
- **SQLite**: Lightweight database
- **Python 3.8+**: Runtime environment

## 🔧 Configuration

### Environment Variables
- `SQLALCHEMY_DATABASE_URI`: Database connection string
- `SECRET_KEY`: Flask secret key for sessions
- `DEBUG`: Enable debug mode (development only)

### CORS Configuration
```python
CORS(app, origins="*", supports_credentials=True)
```

## 🧪 Testing

### Manual Testing
1. Start the server: `python app.py`
2. Use Postman or curl to test endpoints
3. Verify database entries with SQLite browser

### Example curl Commands
```bash
# Register user
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Login user
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Save document
curl -X POST http://localhost:5000/api/scan-id \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"id_type":"Driver License","id_number":"DL123456789"}'
```

## 🚨 Error Handling

### Common Error Responses
- **400 Bad Request**: Missing required fields
- **401 Unauthorized**: Invalid credentials
- **404 Not Found**: User or resource not found
- **409 Conflict**: Username already exists
- **500 Internal Server Error**: Server-side errors

### Error Response Format
```json
{
    "message": "Error description"
}
```

## 🔮 Future Enhancements

- **JWT Authentication**: Token-based authentication
- **File Upload**: Real image storage
- **OCR Integration**: Text extraction from images
- **Document Validation**: Expiry date checking
- **API Rate Limiting**: Prevent abuse
- **Logging**: Comprehensive request logging
- **Unit Tests**: Automated testing suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test all endpoints
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with Flask and SQLAlchemy for secure digital identity management.**