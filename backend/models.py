from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    id_image = db.Column(db.LargeBinary, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class IDInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    id_type = db.Column(db.String(50), nullable=False)
    id_number = db.Column(db.String(100), nullable=False)
    id_image = db.Column(db.LargeBinary, nullable=True)  # Store the actual scanned image
    raw_text = db.Column(db.Text, nullable=True)  # Store OCR raw text
    extracted_data = db.Column(db.Text, nullable=True)  # Store JSON of extracted data
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('ids', lazy=True))

    def __repr__(self):
        return f'<IDInfo {self.id_type} {self.id_number}>'