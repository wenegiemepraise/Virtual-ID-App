from flask import Flask
from models import db, User

# Create Flask app for database initialization
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app
db.init_app(app)

# Create all tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully!")
    print("Models available:")
    print("- User: username, password_hash, id_image")
    print("- IDInfo: user_id, id_type, id_number")