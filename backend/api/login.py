from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from models import db, User

login_bp = Blueprint('login', __name__)

@login_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required.'}), 400

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        return jsonify({
            'message': 'Login successful!',
            'user': {
                'id': user.id,
                'username': user.username
            }
        }), 200
    else:
        return jsonify({'message': 'Invalid username or password.'}), 401
