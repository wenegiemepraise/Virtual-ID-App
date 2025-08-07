from flask import Blueprint, request, jsonify
from models import db, User

register_bp = Blueprint('register', __name__)

@register_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required.'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists.'}), 409

    # Create user with empty id_image for now (will be updated later)
    new_user = User(username=username, id_image=b'')
    new_user.set_password(password)  # Use the model's password hashing method
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Account created successfully!'}), 201


@register_bp.route('/')
def hello():
    return "Hello, World!"