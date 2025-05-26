<template>
  <div class="witch-font-converter">
    <h2 style="color:#f4fef9">魔女文字转换工具</h2>
    <div class="input-area">
      <label style="color:#f4fef9">选择字体：</label>
      <select v-model="selectedFont">
        <option v-for="font in fonts" :key="font.cssName + font.name" :value="font">
          {{ font.name }}
        </option>
      </select>
      <textarea v-model="inputText" placeholder="请输入英文/数字/德语文字" rows="3"></textarea>
      <button @click="downloadImage">下载截图</button>
    </div>
    <div class="output-area" ref="outputArea">
      <pre
        :style="{fontFamily: selectedFont.cssName, fontSize: '2.2rem', background: 'transparent', color: 'black', margin: 0, padding: 0, border: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-all', textAlign: 'left'}"
        :key="selectedFont.cssName">{{selectedFont.name === '古代体' ? inputText.toUpperCase() : selectedFont.name === '现代体' ? inputText.toLowerCase() : inputText }}</pre>
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
        selectedFont: { name: '古代体', cssName: 'MadokaRunes' },
        fonts: [
          { name: '古代体', cssName: 'MadokaRunes' },
          { name: '现代体', cssName: 'MadokaRunes' },
          { name: '音乐体', cssName: 'MadokaMusical' },
          { name: '哥特体', cssName: 'nkf11_magicum_texturae' },
          { name: '黑花体', cssName: 'MadokaLetters' },
          { name: '圆体', cssName: 'nkf10_magicum_comicum_crassum' },
        ]
      }
    },
    methods: {
      async downloadImage() {
        const node = this.$refs.outputArea;
        if (!node) return;
        const canvas = await html2canvas(node, { backgroundColor: null });
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
    margin-top: 5rem;
    background: #2d133b;
    color: black;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px #dcfaf5;
    width: 100%;
    max-width: 60vw;
    min-width: 500px;

    @media (max-width: 768px) {
      max-width: 90vw;
      margin-top: 45%;
      min-width: 30vw;
    }

    box-sizing: border-box;
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