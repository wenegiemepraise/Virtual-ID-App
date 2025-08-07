from flask import Blueprint, request, jsonify
from models import User, IDInfo, db
from werkzeug.security import check_password_hash

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

@routes.route('/api/scan-id', methods=['POST'])
def scan_id():
    data = request.get_json()
    user_id = data.get('user_id')
    id_type = data.get('id_type')
    id_number = data.get('id_number')
    
    if not user_id or not id_type or not id_number:
        return jsonify({'message': 'User ID, ID type, and ID number are required'}), 400
    
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Create new ID info entry
    new_id_info = IDInfo(
        user_id=user_id,
        id_type=id_type,
        id_number=id_number
    )
    
    db.session.add(new_id_info)
    db.session.commit()
    
    return jsonify({'message': 'ID scanned and saved successfully'}), 200

@routes.route('/api/get-ids/<int:user_id>', methods=['GET'])
def get_ids(user_id):
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Get all IDs for the user
    ids = IDInfo.query.filter_by(user_id=user_id).all()
    
    id_list = []
    for id_info in ids:
        id_list.append({
            'id': id_info.id,
            'id_type': id_info.id_type,
            'id_number': id_info.id_number
        })
    
    return jsonify({
        'message': 'Retrieved IDs successfully',
        'ids': id_list
    }), 200

def init_app(app):
    app.register_blueprint(routes)