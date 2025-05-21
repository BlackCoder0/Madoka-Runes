<template>
  <div class="witch-font-converter">
    <h2>魔女文字转换工具</h2>
    <div class="input-area">
      <label>选择字体：</label>
      <select v-model="selectedFont">
        <option v-for="font in fonts" :key="font.cssName" :value="font.cssName">{{ font.name }}</option>
      </select>
      <textarea v-model="inputText" placeholder="请输入英文/数字/德语文字" rows="3"></textarea>
      <button @click="downloadImage">下载截图</button>
    </div>
    <div class="output-area" ref="outputArea">
      <span :style="{fontFamily: selectedFont, fontSize: '2.2rem', background: 'transparent', color: 'black' }">{{ inputText }}</span>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
export default {
  name: 'WitchFontConverter',
  data() {
    return {
      inputText: '',
      selectedFont: 'MadokaRunes',
      fonts: [
        { name: 'MadokaLetters', cssName: 'MadokaLetters' },
        { name: 'MadokaMusical', cssName: 'MadokaMusical' },
        { name: 'MadokaRunes', cssName: 'MadokaRunes' },
        { name: 'MadokaRunes-2.0', cssName: 'MadokaRunes-2.0' },
        { name: 'nkf10_magicum_comicum_crassum', cssName: 'nkf10_magicum_comicum_crassum' },
        { name: 'nkf11_magicum_texturae', cssName: 'nkf11_magicum_texturae' }
      ]
    }
  },
  methods: {
    async downloadImage() {
      const node = this.$refs.outputArea;
      if (!node) return;
      const canvas = await html2canvas(node, {backgroundColor: null});
      const link = document.createElement('a');
      link.download = 'witch-font.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }
}
</script>

<style scoped>
.witch-font-converter {
  margin-bottom: 2rem;
  background: #fff7fa;
  color:black;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px #e0bfe6;
}
.input-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.2rem;
}
textarea {
  resize: vertical;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  font-size: 1.1rem;
}
select {
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  padding: 0.3rem 0.6rem;
  font-size: 1rem;
}
button {
  background: #eeb7e1;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #d48fc7;
}
.output-area {
  min-height: 3.5rem;
  border: 1px dashed #e0bfe6;
  border-radius: 8px;
  padding: 1rem;
  background: transparent;
  word-break: break-all;
}
</style>