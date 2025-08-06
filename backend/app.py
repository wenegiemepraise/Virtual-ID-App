from flask import Flask
from models import db
from api.register import register_bp
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'  # Update as needed
db.init_app(app)

CORS(app, origins="*", supports_credentials=True)  # Allow all origins, adjust as needed

# Register your blueprint
app.register_blueprint(register_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')