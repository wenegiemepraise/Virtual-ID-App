from flask import Blueprint, request, jsonify
from models import User, IDInfo, db
import base64

routes = Blueprint('routes', __name__)

@routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400
    
    new_user = User(username=username, id_image=b'')
    new_user.set_password(password)  # Use the model's password hashing method
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@routes.route('/api/scan-id', methods=['POST'])
def scan_id():
    data = request.get_json()
    user_id = data.get('user_id')
    id_type = data.get('id_type')
    id_number = data.get('id_number')
    id_image = data.get('id_image', '')  # Base64 encoded image
    raw_text = data.get('raw_text', '')
    extracted_data = data.get('extracted_data', '')
    
    if not user_id or not id_type or not id_number:
        return jsonify({'message': 'User ID, ID type, and ID number are required'}), 400
    
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Convert base64 image to binary if provided
    image_binary = None
    if id_image:
        try:
            # Remove data URL prefix if present
            if id_image.startswith('data:image'):
                id_image = id_image.split(',')[1]
            image_binary = base64.b64decode(id_image)
        except Exception as e:
            return jsonify({'message': 'Invalid image data'}), 400
    
    # Create new ID info entry
    new_id_info = IDInfo(
        user_id=user_id,
        id_type=id_type,
        id_number=id_number,
        id_image=image_binary,
        raw_text=raw_text,
        extracted_data=extracted_data
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
        id_data = {
            'id': id_info.id,
            'id_type': id_info.id_type,
            'id_number': id_info.id_number,
            'created_at': id_info.created_at.isoformat() if id_info.created_at else None,
            'updated_at': id_info.updated_at.isoformat() if id_info.updated_at else None
        }
        
        # Include image data if available
        if id_info.id_image:
            id_data['has_image'] = True
            # Don't include actual image data in list view for performance
        
        id_list.append(id_data)
    
    return jsonify({
        'message': 'Retrieved IDs successfully',
        'ids': id_list
    }), 200

@routes.route('/api/get-id-details/<int:id_id>', methods=['GET'])
def get_id_details(id_id):
    # Get specific ID details including image
    id_info = IDInfo.query.get(id_id)
    if not id_info:
        return jsonify({'message': 'ID not found'}), 404
    
    id_data = {
        'id': id_info.id,
        'id_type': id_info.id_type,
        'id_number': id_info.id_number,
        'raw_text': id_info.raw_text,
        'extracted_data': id_info.extracted_data,
        'created_at': id_info.created_at.isoformat() if id_info.created_at else None,
        'updated_at': id_info.updated_at.isoformat() if id_info.updated_at else None
    }
    
    # Include image data if available
    if id_info.id_image:
        id_data['image_data'] = base64.b64encode(id_info.id_image).decode('utf-8')
    
    return jsonify({
        'message': 'Retrieved ID details successfully',
        'id_info': id_data
    }), 200

def init_app(app):
    app.register_blueprint(routes)