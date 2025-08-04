from flask import Blueprint, request, jsonify
from models import User, db

routes = Blueprint('routes', __name__)

@routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400
    
    new_user = User(username=username)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@routes.route('/scan-id', methods=['POST'])
def scan_id():
    data = request.get_json()
    user_id = data.get('user_id')
    id_image = data.get('id_image')
    
    if not user_id or not id_image:
        return jsonify({'message': 'User ID and ID image are required'}), 400
    
    # Logic to save the ID image associated with the user would go here
    
    return jsonify({'message': 'ID scanned successfully'}), 200

@routes.route('/get-ids/<int:user_id>', methods=['GET'])
def get_ids(user_id):
    # Logic to retrieve stored IDs for the user would go here
    return jsonify({'message': 'Retrieved IDs successfully'}), 200

def init_app(app):
    app.register_blueprint(routes)