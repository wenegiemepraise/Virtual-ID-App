from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
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

    hashed_password = generate_password_hash(password)
    # Create user with empty id_image for now (will be updated later)
    new_user = User(username=username, password_hash=hashed_password, id_image=b'')
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Account created successfully!'}), 201


@register_bp.route('/')
def hello():
    return "Hello, World!"