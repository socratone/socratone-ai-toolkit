import os
from flask import Flask
from flask_cors import CORS
from routes.pdf_routes import pdf_blueprint
from routes.youtube_routes import youtube_blueprint
from routes.chat_gpt_routes import chat_gpt_blueprint
from routes.ocr_routes import ocr_blueprint
from dotenv import load_dotenv

os.environ["HF_HOME"] = "./models"

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(pdf_blueprint)
app.register_blueprint(youtube_blueprint)
app.register_blueprint(chat_gpt_blueprint)
app.register_blueprint(ocr_blueprint)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
