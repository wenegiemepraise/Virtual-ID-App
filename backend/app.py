from flask import Flask
from models import db
from api.register import register_bp
from api.login import login_bp
from routes import routes
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'  # Update as needed
db.init_app(app)

CORS(app, origins="*", supports_credentials=True)  # Allow all origins, adjust as needed

# Register your blueprints
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')