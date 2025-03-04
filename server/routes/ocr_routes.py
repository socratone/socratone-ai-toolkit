from flask import Blueprint, request, jsonify
from PIL import Image
import pytesseract

ocr_blueprint = Blueprint("ocr", __name__)


@ocr_blueprint.route("/ocr", methods=["POST"])
def upload_image():
    """
    이미지를 업로드하고 OCR을 통해 텍스트를 추출하는 API

    클라이언트는 선택적으로 'lang' 파라미터를 전송하여 언어를 지정할 수 있습니다.
    지원 언어: 'eng'(영어), 'kor'(한국어), 'kor+eng'(한국어+영어)

    Returns:
        JSON: 추출된 텍스트 또는 에러 메시지
    """
    # 파일이 요청에 포함되어 있는지 확인
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No image selected"}), 400

    # 언어 설정 (기본값: 한국어)
    lang = request.form.get("lang", "kor")

    # 지원하는 언어 목록
    supported_langs = ["eng", "kor", "kor+eng"]

    # 지원하지 않는 언어인 경우 기본값으로 설정
    if lang not in supported_langs:
        lang = "kor"

    try:
        # 이미지를 읽어 텍스트로 변환 (언어 옵션 적용)
        image = Image.open(file.stream)
        text = pytesseract.image_to_string(image, lang=lang)

        return jsonify({"text": text, "language": lang})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
