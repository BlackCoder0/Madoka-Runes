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



      <label style="color:#f4fef9">字体颜色：</label>
      <div class="color-row">
  <select v-model="fontColor">
    <option v-for="color in fixedColors" :key="color.value" :value="color.value">
      {{ color.name }}
    </option>
  </select>

  <input
    ref="colorPicker"
    class="jscolor"
    :value="fontColor"
    @input="fontColor = $event.target.value"
    data-jscolor="{ preset: 'dark', closeButton: true, closeText: 'OK' }"
  />
</div>

      <label style="color:#f4fef9">字体大小 (px)：</label>
      <input type="number" v-model="fontSize" min="1">


      <textarea v-model="inputText" placeholder="请输入英文/数字/德语文字" rows="3"></textarea>
      <button @click="renderCanvasAndDownload">下载截图</button>
    </div>

    <div class="output-area" ref="outputArea">
      <pre :style="{
          fontFamily: selectedFont.cssName,
          fontSize: fontSize + 'rem',
          background: backgroundColor,
          color: fontColor,
          margin: 0,
          padding: '0',
          border: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          textAlign: 'left'
        }">{{ displayText }}</pre>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WitchFontConverter',
    data() {
      return {
        inputText: '',
        selectedFont: { name: '古代体', cssName: 'MadokaRunes' },
        fontColor: '#000000',
        fontSize: 2.2,
        fixedColors: [
          { name: '黑色', value: '#000000' },
          { name: '鹿目圆色', value: '#ff99cc' },
          { name: '晓美焰色', value: '#935ba5' },
          { name: '巴麻美色', value: '#F4DE90' },
          { name: '沙耶香色', value: '#0059d6' },
          { name: '杏子色', value: '#E60000' },
          { name: '白色', value: '#FFFFFF' },
        ],
        fonts: [
          { name: '古代体', cssName: 'MadokaRunes' },
          { name: '现代体', cssName: 'MadokaRunes' },
          { name: '音乐体', cssName: 'MadokaMusical' },
          { name: '哥特体', cssName: 'nkf11_magicum_texturae' },
          { name: '黑花体', cssName: 'MadokaLetters' },
          { name: '圆体', cssName: 'nkf10_magicum_comicum_crassum' }
        ]
      };
    },
    computed: {
      displayText() {
        if (this.selectedFont.name === '古代体') return this.inputText.toUpperCase();
        if (this.selectedFont.name === '现代体') return this.inputText.toLowerCase();
        return this.inputText;
      }
    },
    methods: {
      updateFontColor(picker) {
        this.fontColor = '#' + picker.toHEXString();
      },
      renderCanvasAndDownload() {
        const text = this.displayText;
        const fontName = this.selectedFont.cssName;
        const fontLabel = this.selectedFont.name;
        const fontSize = this.fontSize * 16; // Convert rem to px (assuming 1rem = 16px)
        const lineHeight = fontSize * 1.4;
        const padding = 20;
        const ratio = 1; // 移除导出倍数，固定为1

        const lines = text.split('\n');

        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        ctx.font = `${fontSize}px '${fontName}'`;
        const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));

        const canvasWidth = Math.ceil(maxLineWidth + padding * 2);
        const canvasHeight = Math.ceil(lines.length * lineHeight + padding * 2);

        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth * ratio;
        canvas.height = canvasHeight * ratio;

        const finalCtx = canvas.getContext('2d');
        finalCtx.scale(ratio, ratio);

        finalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        finalCtx.font = `${fontSize}px '${fontName}'`;
        finalCtx.textBaseline = 'top';
        finalCtx.fillStyle = this.fontColor;

        lines.forEach((line, index) => {
          finalCtx.fillText(line, padding, padding + index * lineHeight);
        });

        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
        // 获取输入内容前10个字符（去除空格和特殊符号）
        const shortContent = text.replace(/[^\w\u4e00-\u9fa5]/g, '').slice(0, 10) || 'text';
        const filename = `${fontLabel}-${shortContent}-${timestamp}.png`;
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
      },
    },
    mounted() {
    this.$nextTick(() => {
      if (window.jscolor && this.$refs.colorPicker) {
        this.jscolorInstance = new window.jscolor(this.$refs.colorPicker);
      }
    });
  },
  watch: {
  fontColor(newVal) {
    if (this.jscolorInstance) {
      this.jscolorInstance.fromString(newVal);
    }
  }
}
};
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

  select,
  input[type="color"] {
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
    padding: 0.5rem;
    background: transparent;
    word-break: break-all;
  }
  .color-row {
  display: flex;
  gap: 1rem;
}

.color-row select,
.color-row input {
  width: 50%;
}


  @media (max-width: 768px) {
    .witch-font-converter {
      max-width: 90vw;
      margin-top: 45%;
      min-width: 30vw;
    }
  }
</style>