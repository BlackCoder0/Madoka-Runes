import pytesseract
from PIL import Image
import os
# Add imports for training libraries here (e.g., tensorflow, etc.)
import tensorflow as tf

# Load the trained model and fonts
# Assuming the model is trained and saved as 'trained_model'

class OCRModel:
    def __init__(self):
        # Load the trained model
        self.model = self.load_model('trained_model') # Uncomment and implement load_model
        # For now, using pytesseract directly
        # pass

    def set_tesseract_cmd(self, cmd_path):
        import pytesseract
        pytesseract.pytesseract.tesseract_cmd = cmd_path

    def load_model(self, model_path):
        # 加载自定义Keras模型
        if os.path.exists(model_path):
            return tf.keras.models.load_model(model_path)
        else:
            return None

    def train_model(self, data_folder, output_path):
        import numpy as np
        import tensorflow as tf
        import string
        from PIL import Image
        import os
        chars = sorted(os.listdir(data_folder))
        char_to_idx = {c: i for i, c in enumerate(chars)}
        images = []
        labels = []
        for c in chars:
            char_dir = os.path.join(data_folder, c)
            if not os.path.isdir(char_dir):
                continue
            for fname in os.listdir(char_dir):
                if fname.lower().endswith('.png') or fname.lower().endswith('.jpg'):
                    img_path = os.path.join(char_dir, fname)
                    img = Image.open(img_path).convert('RGB').resize((64, 64))
                    arr = np.array(img) / 255.0
                    images.append(arr)
                    labels.append(char_to_idx[c])
        x = np.stack(images)
        y = tf.keras.utils.to_categorical(labels, num_classes=len(chars))
        model = tf.keras.Sequential([
            tf.keras.layers.InputLayer(input_shape=(64, 64, 3)),
            tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.MaxPooling2D((2, 2)),
            tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.MaxPooling2D((2, 2)),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dense(len(chars), activation='softmax')
        ])
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        model.fit(x, y, epochs=10, batch_size=32, validation_split=0.1)
        model.save(output_path)

    def recognize_text(self, image_path):
        # Open image
        image = Image.open(image_path)

        # Use the trained model for OCR
        # If a custom model is loaded, use it here
        if self.model:
            # 使用自定义Keras模型进行单字符识别（假设每张图片只包含一个字符）
            img = image.convert('RGB').resize((64, 64))
            arr = np.array(img) / 255.0
            arr = arr.reshape((1, 64, 64, 3))
            pred = self.model.predict(arr)
            pred_idx = pred.argmax(axis=1)[0]
            # 需要在模型实例中保存字符索引到字符的映射
            if hasattr(self, 'idx_to_char'):
                text = self.idx_to_char[pred_idx]
            else:
                text = str(pred_idx)
        else:
            # Fallback to pytesseract if no custom model is loaded
            text = pytesseract.image_to_string(image)
        return text

# Example usage (commented out as it's not needed for the Flask app)
# ocr_model = OCRModel()
# result = ocr_model.recognize_text('path_to_image')
# print(result)