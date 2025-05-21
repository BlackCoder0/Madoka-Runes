<template>
  <div class="witch-font-ocr">
    <h2>魔女文字OCR识别</h2>
    <div class="ocr-upload-area">
      <input type="file" accept="image/*" @change="onFileChange" />
      <button v-if="imageUrl" @click="doOCR">开始识别</button>
    </div>
    <div v-if="imageUrl" class="ocr-preview">
      <img :src="imageUrl" alt="上传图片预览" />
    </div>
    <div v-if="ocrResult" class="ocr-result">
      <h3>识别结果：</h3>
      <div class="ocr-text">{{ ocrResult }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WitchFontOCR',
  data() {
    return {
      imageUrl: '',
      ocrResult: ''
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.imageUrl = URL.createObjectURL(file);
        this.ocrResult = '';
        this.file = file;
      }
    },
    async doOCR() {
      if (!this.file) return;
      // TODO: 调用后端OCR API，传递图片并获取识别结果
      // 示例：
      // const formData = new FormData();
      // formData.append('file', this.file);
      // const res = await fetch('/api/ocr', { method: 'POST', body: formData });
      // const data = await res.json();
      // this.ocrResult = data.text;
      this.ocrResult = '（此处展示后端返回的识别结果）';
    }
  }
}
</script>

<style scoped>
.witch-font-ocr {
  margin-bottom: 2rem;
  background: #f7e6f7;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px #e0bfe6;
}
.ocr-upload-area {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.ocr-preview img {
  max-width: 320px;
  max-height: 180px;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px #e0bfe6;
}
.ocr-result {
  margin-top: 1.2rem;
  background: #fff7fa;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e0bfe6;
}
.ocr-text {
  font-size: 1.1rem;
  color: #a84b8c;
  word-break: break-all;
}
</style>