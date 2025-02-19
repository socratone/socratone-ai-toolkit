from flask import Flask
from flask_cors import CORS
from routes.pdf_routes import pdf_blueprint
from routes.youtube_routes import youtube_blueprint

import os
os.environ['TRANSFORMERS_CACHE'] = './models'

app = Flask(__name__)
CORS(app)

app.register_blueprint(pdf_blueprint)
app.register_blueprint(youtube_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
