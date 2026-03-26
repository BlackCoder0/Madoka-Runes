<template>
  <div class="witch-font-tools">
    <div class="tool-tabs" role="tablist" aria-label="转换工具标签">
      <button
        v-for="tab in tabs"
        :id="`${tab.key}-tab`"
        :key="tab.key"
        type="button"
        class="tab-button"
        :class="{ active: activeTab === tab.key }"
        :aria-selected="activeTab === tab.key"
        :aria-controls="`${tab.key}-panel`"
        @click="activeTab = tab.key"
      >
        <span class="tab-eyebrow">{{ tab.eyebrow }}</span>
        <span class="tab-title">{{ tab.title }}</span>
      </button>
    </div>

    <section
      id="convert-panel"
      v-show="activeTab === 'convert'"
      class="tool-section convert-section"
      role="tabpanel"
      aria-labelledby="convert-tab"
    >
      <div class="section-header">
        <span class="section-tag">正向转换</span>
        <h2>输入文字转魔女文</h2>
      </div>
      <p class="section-desc">输入英文、数字或德文字母，选择字体后即时生成魔女文预览，并可下载透明背景图片。</p>

      <div class="input-area">
        <label>选择字体</label>
        <select v-model="selectedFontKey">
          <option v-for="font in converterFonts" :key="font.key" :value="font.key">
            {{ font.label }}
          </option>
        </select>

        <label>字体颜色</label>
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
          >
        </div>

        <label>字体大小（px）</label>
        <input v-model.number="fontSize" type="number" min="1">

        <label>输入原文</label>
        <textarea
          v-model="inputText"
          placeholder="请输入英文、数字或德文字母"
          rows="4"
        />

        <button type="button" @click="renderCanvasAndDownload">下载截图</button>
      </div>

      <div class="output-panel">
        <div class="panel-label">魔女文预览</div>
        <pre
          class="preview-output"
          :style="{
            fontFamily: selectedFont.cssName,
            fontSize: `${fontSize}px`,
            color: fontColor
          }"
        >{{ displayText || '预览将显示在这里' }}</pre>
      </div>
    </section>

    <section
      id="translate-panel"
      v-show="activeTab === 'translate'"
      class="tool-section translate-section"
      role="tabpanel"
      aria-labelledby="translate-tab"
    >
      <div class="section-header">
        <span class="section-tag">反向翻译</span>
        <h2>魔女文转普通字符</h2>
      </div>
      <p class="section-desc">
        这个区域单独用于反向翻译。你可以先选择字形，再直接输入键盘字符（例如输入 <code>j</code>），
        或点击下方字表录入魔女文字符。
      </p>

      <div class="translate-layout">
        <div class="translate-controls">
          <label>翻译所用字体</label>
          <select v-model="translationFontKey">
            <option v-for="font in translationFontOptions" :key="font.key" :value="font.key">
              {{ font.label }}
            </option>
          </select>

          <label>魔女文输入</label>
          <textarea
            :value="translationInput"
            class="translation-input"
            :style="{ fontFamily: translationFont.font, fontSize: `${translationFontSize}px` }"
            placeholder="先选字体后输入，例如输入 j；也可以点击下方字表录入。"
            rows="4"
            @input="handleTranslationInput"
          />

          <div class="translate-actions">
            <button type="button" @click="removeLastTranslationChar">删除最后一个字符</button>
            <button type="button" class="secondary-button" @click="clearTranslationInput">清空输入</button>
          </div>

          <div class="helper-box">
            当前字形：<strong>{{ translationFont.label }}</strong>
            <span>点击字表任意字符时，会自动切换到对应字体并插入该字符。</span>
          </div>
        </div>

        <div class="output-panel translation-output-panel">
          <div class="panel-label">翻译结果</div>
          <pre class="translation-output">{{ translatedText || '翻译结果将显示在这里' }}</pre>
        </div>
      </div>

      <div class="table-shell">
        <WitchFontTable
          compact
          interactive
          :show-intro="false"
          :show-font-info="false"
          title="可点击录入的魔女文字表"
          @select-character="handleRuneSelect"
        />
      </div>
    </section>
  </div>
</template>

<script>
import WitchFontTable from './WitchFontTable.vue';
import {
  createFontLookup,
  getWitchFontByKey,
  normalizeTextForFont,
  witchFontMap
} from '../constants/witchFontMap';

const converterFonts = [
  { key: 'ancient', label: '古代体', cssName: 'MadokaRunes2' },
  { key: 'modern', label: '现代体', cssName: 'MadokaRunes2' },
  { key: 'musical', label: '音乐体', cssName: 'MadokaMusical' },
  { key: 'gothic', label: '哥特体', cssName: 'nkf11_magicum_texturae' },
  { key: 'blackletter', label: '黑花体', cssName: 'MadokaLetters' },
  { key: 'round', label: '圆体', cssName: 'nkf10_magicum_comicum_crassum' }
];

const fixedColors = [
  { name: '黑色', value: '#000000' },
  { name: '粉色', value: '#ff99cc' },
  { name: '晓美焰紫', value: '#935ba5' },
  { name: '巴麻美黄', value: '#f4de90' },
  { name: '沙耶香蓝', value: '#0059d6' },
  { name: '杏子红', value: '#e60000' },
  { name: '白色', value: '#ffffff' }
];

const tabs = [
  { key: 'convert', eyebrow: 'Convert', title: '正向转换' },
  { key: 'translate', eyebrow: 'Translate', title: '反向翻译' }
];

export default {
  name: 'WitchFontTools',
  components: {
    WitchFontTable
  },
  data() {
    return {
      tabs,
      activeTab: 'convert',
      converterFonts,
      fixedColors,
      inputText: '',
      selectedFontKey: 'ancient',
      fontColor: '#000000',
      fontSize: 32,
      translationInput: '',
      translationFontKey: 'ancient',
      translationFontSize: 32
    };
  },
  computed: {
    selectedFont() {
      return this.converterFonts.find((font) => font.key === this.selectedFontKey) ?? this.converterFonts[0];
    },
    displayText() {
      if (this.selectedFontKey === 'ancient') {
        return this.inputText.toUpperCase();
      }

      if (this.selectedFontKey === 'modern') {
        return this.inputText.toLowerCase();
      }

      return this.inputText;
    },
    translationFontOptions() {
      return witchFontMap.map(({ key, label }) => ({ key, label }));
    },
    translationFont() {
      return getWitchFontByKey(this.translationFontKey);
    },
    translatedText() {
      const lookup = createFontLookup(this.translationFontKey);

      return Array.from(this.translationInput)
        .map((char) => {
          if (char === '\n' || char === '\r' || char === '\t') {
            return char;
          }

          if (char === ' ') {
            return ' ';
          }

          return lookup.get(char) ?? char;
        })
        .join('');
    }
  },
  watch: {
    fontColor(newVal) {
      if (this.jscolorInstance) {
        this.jscolorInstance.fromString(newVal);
      }
    },
    translationFontKey(newVal) {
      this.translationInput = normalizeTextForFont(newVal, this.translationInput);
    }
  },
  methods: {
    handleTranslationInput(event) {
      this.translationInput = normalizeTextForFont(this.translationFontKey, event.target.value);
    },
    handleRuneSelect(payload) {
      const normalizedExistingText = normalizeTextForFont(payload.fontKey, this.translationInput);

      this.activeTab = 'translate';
      this.translationFontKey = payload.fontKey;
      this.translationInput = `${normalizedExistingText}${payload.runeChar}`;
    },
    clearTranslationInput() {
      this.translationInput = '';
    },
    removeLastTranslationChar() {
      this.translationInput = Array.from(this.translationInput).slice(0, -1).join('');
    },
    renderCanvasAndDownload() {
      const text = this.displayText;
      const fontName = this.selectedFont.cssName;
      const fontLabel = this.selectedFont.label;
      const fontSize = this.fontSize;
      const actualLineHeight = Math.ceil(fontSize * 1.1);
      const padding = 8;
      const lines = text.split('\n');

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.font = `${fontSize}px '${fontName}'`;

      const maxLineWidth = Math.max(...lines.map((line) => tempCtx.measureText(line).width), 0);
      const canvasWidth = Math.ceil(maxLineWidth + padding * 2);
      const canvasHeight = Math.ceil(lines.length * actualLineHeight + padding * 2);

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const finalCtx = canvas.getContext('2d');
      finalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      finalCtx.font = `${fontSize}px '${fontName}'`;
      finalCtx.textBaseline = 'top';
      finalCtx.fillStyle = this.fontColor;

      lines.forEach((line, index) => {
        finalCtx.fillText(line, padding, padding + index * actualLineHeight);
      });

      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const shortContent = text.replace(/[^\w\u4e00-\u9fa5]/g, '').slice(0, 10) || 'text';
      const filename = `${fontLabel}-${shortContent}-${timestamp}.png`;
      const link = document.createElement('a');

      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (window.jscolor && this.$refs.colorPicker) {
        this.jscolorInstance = new window.jscolor(this.$refs.colorPicker);
      }
    });
  }
};
</script>

<style scoped>
.witch-font-tools {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 8.5rem auto 2rem;
  width: min(72vw, 1120px);
  min-width: 320px;
}

.tool-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  width: min(44rem, 100%);
  margin: 0 auto 0.4rem;
  padding: 0.45rem;
  border-radius: 22px;
  background: rgba(18, 10, 28, 0.72);
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 32px rgba(11, 5, 20, 0.24);
}

.tab-button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  background: rgba(28, 18, 40, 0.72);
  padding: 1rem 1.1rem;
  text-align: left;
  box-shadow: 0 10px 30px rgba(11, 5, 20, 0.22);
}

.tab-button.active {
  background: linear-gradient(135deg, rgba(113, 67, 136, 0.95), rgba(231, 154, 202, 0.92));
  box-shadow: 0 14px 36px rgba(11, 5, 20, 0.34);
}

.tab-eyebrow {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(244, 241, 248, 0.7);
  font-family: 'Segoe UI', Arial, sans-serif;
}

.tab-title {
  color: #fff7fc;
  font-size: 1.1rem;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.tool-section {
  border-radius: 18px;
  padding: 1.4rem;
  box-shadow: 0 10px 30px rgba(11, 5, 20, 0.3);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.convert-section {
  background: rgba(68, 44, 69, 0.92);
}

.translate-section {
  background: rgba(34, 28, 61, 0.94);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.section-header h2 {
  margin: 0;
  color: #f4fef9;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 5.4rem;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff2fb;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
}

.section-desc {
  margin: 0.8rem 0 1.2rem;
  color: #f3e6fa;
  text-align: left;
  font-family: 'Segoe UI', Arial, sans-serif;
  line-height: 1.7;
}

.input-area,
.translate-controls {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

label,
.panel-label,
.helper-box,
.section-desc code {
  font-family: 'Segoe UI', Arial, sans-serif;
}

label {
  text-align: left;
  color: #f4fef9;
}

textarea,
select,
input[type='number'] {
  width: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 0.7rem 0.8rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.92);
  color: #23162e;
}

textarea {
  resize: vertical;
  min-height: 7rem;
  line-height: 1.5;
}

.translation-input {
  background: rgba(250, 244, 255, 0.94);
}

.color-row {
  display: flex;
  gap: 1rem;
}

.color-row select,
.color-row input {
  width: 50%;
}

.tool-section button {
  background: #eeb7e1;
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 0.65rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
}

.tool-section button:hover {
  background: #d48fc7;
  transform: translateY(-1px);
}

.secondary-button {
  background: rgba(255, 255, 255, 0.16);
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.24);
}

.output-panel {
  margin-top: 1.1rem;
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  padding: 0.9rem;
  background: rgba(17, 10, 24, 0.3);
  text-align: left;
}

.panel-label {
  color: #f8d8ff;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.preview-output,
.translation-output {
  min-height: 4.2rem;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.preview-output {
  background: transparent;
}

.translation-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
  gap: 1rem;
  align-items: start;
}

.translation-output-panel {
  height: 100%;
  margin-top: 0;
}

.translation-output {
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 1.15rem;
  color: #fff8ff;
}

.translate-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.helper-box {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #f7ebff;
  line-height: 1.6;
  text-align: left;
}

.table-shell {
  margin-top: 1.2rem;
}

@media (max-width: 900px) {
  .witch-font-tools {
    width: 92vw;
    margin-top: 11rem;
  }

  .translation-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .witch-font-tools {
    width: 94vw;
    margin-top: 13.5rem;
  }

  .tool-tabs {
    grid-template-columns: 1fr;
  }

  .tool-section {
    padding: 1rem;
  }

  .color-row {
    flex-direction: column;
  }

  .color-row select,
  .color-row input {
    width: 100%;
  }

  .translate-actions {
    flex-direction: column;
  }

  .tool-section button {
    width: 100%;
  }
}
</style>
