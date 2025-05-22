from flask import Flask, request, jsonify
from flask_cors import CORS
from ocr_model import OCRModel

app = Flask(__name__)
CORS(app)
ocr_model = OCRModel()
ocr_model.set_tesseract_cmd('D:\\Tesseract-OCR\\tesseract.exe') 

@app.route('/api/ocr', methods=['POST'])
def ocr_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the file temporarily
    file_path = 'temp_image.png'
    file.save(file_path)

    # Perform OCR
    text = ocr_model.recognize_text(file_path)

    # Return the result
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True)