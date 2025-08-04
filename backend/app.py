from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from routes import main as routes

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///virtual_id.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)