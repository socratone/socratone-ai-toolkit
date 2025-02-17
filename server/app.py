from flask import Flask
from flask_cors import CORS
from routes.pdf_routes import pdf_blueprint
from routes.hello_routes import hello_blueprint

app = Flask(__name__)
CORS(app)

app.register_blueprint(pdf_blueprint)
app.register_blueprint(hello_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
