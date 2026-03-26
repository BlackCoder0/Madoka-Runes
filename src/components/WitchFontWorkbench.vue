<template>
  <div class="witch-font-workbench">
    <section class="hero-shell">

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
          <span class="tab-title">{{ tab.title }}</span>
        </button>
      </div>
    </section>

    <section
      id="convert-panel"
      v-show="activeTab === 'convert'"
      class="panel-shell"
      role="tabpanel"
      aria-labelledby="convert-tab"
    >
      <div class="panel-grid convert-grid">
        <article class="card form-card">
          <div class="card-head">
            <span class="section-chip">正向转换</span>
            <h2>输入普通字符，生成魔女文</h2>
          </div>

          <div class="field-grid">
            <label class="field">
              <span class="field-label">选择字体</span>
              <select v-model="selectedFontKey">
                <option v-for="font in converterFonts" :key="font.key" :value="font.key">
                  {{ font.label }}
                </option>
              </select>
            </label>

            <label class="field">
              <span class="field-label">字体大小</span>
              <input v-model.number="fontSize" type="number" min="1">
            </label>

            <label class="field field-span-2">
              <span class="field-label">字体颜色</span>
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
            </label>

            <label class="field field-span-2">
              <span class="field-label">输入原文</span>
              <textarea
                v-model="inputText"
                placeholder="请输入英文、数字或德文字母"
                rows="6"
              />
            </label>
          </div>

          <div class="action-row">
            <button type="button" class="primary-button" @click="renderCanvasAndDownload">下载截图</button>
            <span class="inline-tip">古代体与现代体分别对应字库的大写与小写字形。</span>
          </div>
        </article>

        <article class="card preview-card">
          <div class="card-head">
            <span class="section-chip muted-chip">预览</span>
            <h2>实时输出</h2>
          </div>

          <div class="preview-stage">
            <pre
              class="preview-output"
              :style="{
                fontFamily: selectedFont.cssName,
                fontSize: `${fontSize}px`,
                color: fontColor
              }"
            >{{ displayText || '预览将显示在这里' }}</pre>
          </div>
        </article>
      </div>
    </section>

    <section
      id="translate-panel"
      v-show="activeTab === 'translate'"
      class="panel-shell"
      role="tabpanel"
      aria-labelledby="translate-tab"
    >
      <div class="panel-grid translate-grid">
        <div class="translate-side">
          <article class="card translate-control-card">
            <div class="card-head">
              <span class="section-chip">反向翻译</span>
              <h2>点击字表录入魔女文</h2>
            </div>

            <div class="translate-meta">
              <div class="meta-pill">
                最近录入字体
                <strong>{{ translationFont.label }}</strong>
              </div>
              <div class="meta-pill">已录入 {{ translationEntries.length }} 个片段</div>
            </div>

            <div class="action-row compact-row">
              <button type="button" class="ghost-button" @click="insertSpace">空格</button>
              <button type="button" class="ghost-button" @click="insertLineBreak">换行</button>
              <button type="button" class="primary-button" @click="removeLastTranslationChar">删除最后一个字符</button>
              <button type="button" class="ghost-button" @click="clearTranslationInput">清空内容</button>
            </div>
          </article>

          <article class="card result-card">
            <div class="card-head">
              <span class="section-chip muted-chip">魔女文</span>
              <h2>当前录入内容</h2>
            </div>
            <div class="result-stage rune-stage">
              <div
                v-if="hasTranslationEntries"
                class="mixed-rune-output"
                :style="{ fontSize: `${translationFontSize}px` }"
              >
                <template v-for="(entry, idx) in translationEntries" :key="idx">
                  <br v-if="entry.type === 'newline'">
                  <span v-else-if="entry.type === 'space'" class="rune-space"> </span>
                  <span
                    v-else
                    class="rune-glyph"
                    :style="{ fontFamily: entry.fontFamily }"
                  >
                    {{ entry.runeChar }}
                  </span>
                </template>
              </div>
              <div v-else class="empty-rune-output">点击右侧字表中的魔女文字符后，会显示在这里</div>
            </div>
          </article>

          <article class="card result-card">
            <div class="card-head">
              <span class="section-chip muted-chip">译文</span>
              <h2>翻译结果</h2>
            </div>
            <div class="result-stage">
              <pre class="translation-output">{{ translatedText || '翻译结果将显示在这里' }}</pre>
            </div>
          </article>
        </div>

        <article class="card lookup-card">
          <div class="card-head">
            <div>
              <span class="section-chip muted-chip">字表</span>
              <h2>点击录入</h2>
            </div>
            <p class="lookup-note">点击任意魔女文字符即可录入并翻译</p>
          </div>

          <div class="table-scroll">
            <WitchFontTable
              compact
              interactive
              :show-intro="false"
              :show-font-info="false"
              title="可点击录入的魔女文字表"
              @select-character="handleRuneSelect"
            />
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import WitchFontTable from './WitchFontTable.vue';
import {
  createFontLookup,
  getWitchFontByKey
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
  {
    key: 'convert',
    title: '正向转换'
  },
  {
    key: 'translate',
    title: '反向翻译'
  }
];

export default {
  name: 'WitchFontWorkbench',
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
      translationEntries: [],
      translationFontKey: 'ancient',
      translationFontSize: 30
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
    translationFont() {
      return getWitchFontByKey(this.translationFontKey);
    },
    hasTranslationEntries() {
      return this.translationEntries.length > 0;
    },
    translatedText() {
      const lookups = new Map();

      return this.translationEntries
        .map((entry) => {
          if (entry.type === 'newline') {
            return '\n';
          }

          if (entry.type === 'space') {
            return ' ';
          }

          if (!lookups.has(entry.fontKey)) {
            lookups.set(entry.fontKey, createFontLookup(entry.fontKey));
          }

          const lookup = lookups.get(entry.fontKey);
          return lookup.get(entry.runeChar) ?? entry.runeChar;
        })
        .join('');
    }
  },
  watch: {
    fontColor(newVal) {
      if (this.jscolorInstance) {
        this.jscolorInstance.fromString(newVal);
      }
    }
  },
  methods: {
    handleRuneSelect(payload) {
      this.activeTab = 'translate';
      this.translationFontKey = payload.fontKey;
      this.translationEntries.push({
        type: 'rune',
        fontKey: payload.fontKey,
        fontFamily: payload.fontFamily,
        runeChar: payload.runeChar
      });
    },
    insertSpace() {
      this.translationEntries.push({
        type: 'space'
      });
    },
    insertLineBreak() {
      this.translationEntries.push({
        type: 'newline'
      });
    },
    clearTranslationInput() {
      this.translationEntries = [];
    },
    removeLastTranslationChar() {
      this.translationEntries = this.translationEntries.slice(0, -1);
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
.witch-font-workbench {
  --shell-bg: rgba(17, 9, 25, 0.78);
  --card-bg: rgba(34, 22, 48, 0.88);
  --card-bg-soft: rgba(46, 32, 64, 0.78);
  --line: rgba(255, 255, 255, 0.12);
  --line-strong: rgba(255, 210, 240, 0.28);
  --text-main: #fff6fb;
  --text-soft: #e6d8ef;
  --text-muted: rgba(241, 230, 247, 0.72);
  --accent: #f0a6d6;
  --accent-strong: #c86ca7;
  --accent-deep: #7d4e87;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(76vw, 1200px);
  min-width: 320px;
  margin: 8.8rem auto 2rem;
}

.hero-shell,
.panel-shell {
  border: 1px solid var(--line);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(232, 161, 213, 0.18), transparent 28%),
    linear-gradient(180deg, rgba(27, 16, 38, 0.92), rgba(20, 11, 30, 0.84));
  box-shadow: 0 24px 60px rgba(7, 3, 12, 0.34);
  backdrop-filter: blur(14px);
}

.hero-shell {
  padding: 1.35rem;
}

.hero-copy {
  padding: 0.6rem 0.4rem 1.1rem;
}

.eyebrow {
  margin: 0 0 0.5rem;
  font-family: 'Segoe UI', Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.76rem;
  color: #f2bddf;
}

.hero-copy h1 {
  margin: 0;
  color: var(--text-main);
  font-size: clamp(1.8rem, 2vw, 2.5rem);
  font-family: 'Segoe UI', Arial, sans-serif;
}

.hero-desc {
  margin: 0.9rem 0 0;
  max-width: 46rem;
  color: var(--text-soft);
  line-height: 1.7;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.tool-tabs {
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(14rem, 1fr));
  gap: 0.35rem;
  padding: 0;
  border-radius: 999px;
  background: transparent;
  border: 0;
}

.tab-button {
  min-height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0.78rem 1.25rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: var(--text-muted);
  text-align: center;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.tab-button:hover {
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.03);
}

.tab-button.active {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.32);
  color: var(--text-main);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.tab-button:focus-visible,
.primary-button:focus-visible,
.ghost-button:focus-visible {
  outline: 2px solid #ffd4ec;
  outline-offset: 3px;
}

.tab-title {
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 0.96rem;
  font-weight: 600;
}

.panel-shell {
  padding: 1.35rem;
}

.panel-grid {
  display: grid;
  gap: 1rem;
}

.convert-grid {
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 1.05fr);
}

.translate-grid {
  grid-template-columns: minmax(320px, 0.72fr) minmax(0, 1.28fr);
  align-items: stretch;
}

.card {
  border-radius: 24px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, var(--card-bg), var(--card-bg-soft));
  padding: 1.15rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.card-head {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.card-head h2 {
  margin: 0;
  color: var(--text-main);
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 1.28rem;
}

.section-chip {
  display: inline-flex;
  width: fit-content;
  padding: 0.32rem 0.72rem;
  border-radius: 999px;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff6fb;
  background: rgba(224, 127, 184, 0.22);
  border: 1px solid rgba(255, 213, 236, 0.14);
}

.muted-chip {
  background: rgba(255, 255, 255, 0.09);
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.95rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.48rem;
}

.field-span-2 {
  grid-column: span 2;
}

.field-label,
.inline-tip,
.lookup-note,
.helper-box,
.meta-pill {
  font-family: 'Segoe UI', Arial, sans-serif;
}

.field-label {
  color: var(--text-soft);
}

textarea,
select,
input[type='number'] {
  width: 100%;
  box-sizing: border-box;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.78rem 0.9rem;
  font-size: 1rem;
  background: rgba(251, 247, 255, 0.96);
  color: #23162e;
  box-shadow: inset 0 1px 2px rgba(11, 5, 20, 0.06);
}

textarea {
  resize: vertical;
  min-height: 8rem;
  line-height: 1.6;
}

.color-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 9rem;
  gap: 0.8rem;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.compact-row {
  margin-top: 0.85rem;
}

.primary-button,
.ghost-button {
  min-height: 46px;
  border-radius: 14px;
  padding: 0.72rem 1.1rem;
  border: 1px solid transparent;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 0.98rem;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.primary-button {
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #fff;
}

.ghost-button {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.14);
}

.primary-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
}

.inline-tip {
  color: var(--text-muted);
  line-height: 1.5;
}

.preview-card,
.result-card,
.lookup-card {
  display: flex;
  flex-direction: column;
}

.preview-stage,
.result-stage {
  flex: 1;
  border-radius: 18px;
  border: 1px dashed var(--line-strong);
  background: rgba(10, 6, 18, 0.34);
  padding: 1rem;
  min-height: 22rem;
}

.preview-output,
.translation-output {
  min-height: 100%;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.mixed-rune-output,
.empty-rune-output {
  width: 100%;
  min-height: 100%;
  white-space: pre-wrap;
  word-break: break-all;
}

.mixed-rune-output {
  color: var(--text-main);
  line-height: 1.7;
}

.empty-rune-output {
  color: var(--text-muted);
  font-family: 'Segoe UI', Arial, sans-serif;
  line-height: 1.7;
}

.rune-glyph,
.rune-space {
  display: inline;
}

.rune-space {
  display: inline-block;
  width: 0.72em;
}

.translation-output {
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 1.16rem;
  color: var(--text-main);
  line-height: 1.75;
}

.translate-meta {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-bottom: 0.95rem;
}

.meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.4rem;
  padding: 0.1rem 0.8rem;
  border-radius: 999px;
  color: var(--text-soft);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.helper-box {
  margin-top: auto;
  padding: 0.95rem 1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-soft);
  line-height: 1.7;
}

.helper-box p {
  margin: 0;
}

.translate-side {
  display: grid;
  grid-template-rows: auto minmax(11rem, 1fr) minmax(11rem, 1fr);
  gap: 1rem;
  min-height: 0;
}

.lookup-note {
  margin: 0.35rem 0 0;
  color: var(--text-muted);
  line-height: 1.55;
}

.table-scroll {
  min-height: 0;
  max-height: none;
  overflow: visible;
  padding-right: 0;
}

.table-scroll :deep(.witch-font-all-table.compact) {
  background: transparent;
  border: 0;
  padding: 0;
  box-shadow: none;
}

.table-scroll :deep(.witch-font-all-table-container h2),
.table-scroll :deep(.table-hint) {
  display: none;
}

.table-scroll :deep(.wikitable) {
  background: rgba(24, 15, 34, 0.94);
}

.table-scroll :deep(th) {
  position: sticky;
  top: 0;
  z-index: 1;
}

.table-scroll :deep(.rune-button) {
  min-height: 2.5rem;
}

.rune-stage {
  display: flex;
  align-items: flex-start;
}

@media (max-width: 1100px) {
  .witch-font-workbench {
    width: 92vw;
    margin-top: 10.8rem;
  }

  .convert-grid,
  .translate-grid {
    grid-template-columns: 1fr;
  }

  .translate-side {
    grid-template-rows: auto auto auto;
  }

  .table-scroll {
    max-height: none;
  }
}

@media (max-width: 700px) {
  .witch-font-workbench {
    width: 94vw;
    margin-top: 13.2rem;
  }

  .hero-shell,
  .panel-shell,
  .card {
    border-radius: 22px;
  }

  .tool-tabs,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .field-span-2 {
    grid-column: auto;
  }

  .color-row {
    grid-template-columns: 1fr;
  }

  .preview-stage,
  .result-stage {
    min-height: 14rem;
  }

  .table-scroll {
    max-height: none;
  }
}
</style>
