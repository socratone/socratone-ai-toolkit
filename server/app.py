from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2

app = Flask(__name__)
CORS(app)  # CORS를 Flask 앱에 적용

@app.route('/text-from-pdf', methods=['POST'])
def extract_text():
    try:
        # 파일이 요청에 포함되어 있는지 확인
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']

        # 파일이 비어있는지 확인
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # PDF 파일에서 텍스트 추출
        pdf_reader = PyPDF2.PdfReader(file)
        text = []
        for page in pdf_reader.pages:
            text.append(page.extract_text())
        
        return jsonify({'text': '\n'.join(text)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
