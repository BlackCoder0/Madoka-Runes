<template>
  <div class="witch-font-all-table" :class="{ compact }">
    <div v-if="showIntro" class="witch-font-info">
      <p>
        <strong>魔女文字</strong>（Madoka Runes）是《魔法少女小圆》中出现的架空文字系统，
        常见于魔女结界、使魔涂鸦和相关衍生设定。
      </p>
      <p>
        这套字符与拉丁字母、数字以及少量德文字母存在映射关系，因此既可以正向输入普通文本转换，
        也可以反向按字形查表翻译。
      </p>
      <p>
        下方表格列出了目前站内使用的主要字形版本，便于速查、对照和录入。
      </p>
    </div>

    <div class="witch-font-all-table-container">
      <h2>{{ title }}</h2>
      <p v-if="interactive" class="table-hint">
        点击任意魔女文字符，可把对应字体和字符带入翻译区。
      </p>

      <div class="table-sections">
        <div v-for="(section, sectionIdx) in fontMap[0].sections" :key="sectionIdx">
          <table class="wikitable">
            <thead>
              <tr>
                <th>字体/字符</th>
                <th v-for="char in section.header" :key="char">{{ char }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="font in fontMap" :key="font.key">
                <th>{{ font.label }}</th>
                <td
                  v-for="(char, charIdx) in section.header"
                  :key="`${font.key}-${sectionIdx}-${char}`"
                  :class="{ selectable: interactive && isCellSelectable(font, sectionIdx, charIdx) }"
                  :style="getCellStyle(font)"
                  @click="handleCellAreaClick(font, sectionIdx, charIdx)"
                >
                  <button
                    v-if="interactive && isCellSelectable(font, sectionIdx, charIdx)"
                    type="button"
                    class="rune-button"
                    :style="getCellStyle(font)"
                    @click.stop="handleCellClick(font, sectionIdx, charIdx)"
                  >
                    {{ getCellDisplay(font, sectionIdx, charIdx) }}
                  </button>
                  <span v-else>{{ getCellDisplay(font, sectionIdx, charIdx) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showFontInfo" class="witch-font-info">
      <h2>字体说明</h2>
      <ol>
        <li><strong>古代体</strong>：笔画更复杂，主要对应字库中的大写字母。</li>
        <li><strong>现代体</strong>：更流畅简洁，主要对应字库中的小写字母。</li>
        <li><strong>音乐体</strong>：大量笔画接近音符与旋律线，字符并不完整。</li>
        <li><strong>哥特体</strong>：适合做装饰性展示，字符集最完整。</li>
      </ol>
      <p>
        当前站点使用的魔女文字资源来自
        <a
          href="https://tieba.baidu.com/home/main?id=tb.1.df458a65.pThF7AVtjtVtywlkzrvvHg?t=1586141278&fr=pb"
          target="_blank"
          rel="noreferrer"
        >
          somlibaria
        </a>
        制作的字体整理。
      </p>
    </div>
  </div>
</template>

<script>
import { getDisplayChar, witchFontMap } from '../constants/witchFontMap';

export default {
  name: 'WitchFontTable',
  props: {
    compact: {
      type: Boolean,
      default: false
    },
    interactive: {
      type: Boolean,
      default: false
    },
    showIntro: {
      type: Boolean,
      default: true
    },
    showFontInfo: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '魔女文字字符集总览'
    }
  },
  emits: ['select-character'],
  data() {
    return {
      fontMap: witchFontMap
    };
  },
  methods: {
    getCellDisplay(font, sectionIdx, charIdx) {
      return getDisplayChar(font.key, font.sections[sectionIdx].characters?.[charIdx] ?? '');
    },
    getCellStyle(font) {
      return {
        fontFamily: font.font,
        fontSize: '2rem'
      };
    },
    isCellSelectable(font, sectionIdx, charIdx) {
      return this.getCellDisplay(font, sectionIdx, charIdx) !== '/';
    },
    handleCellAreaClick(font, sectionIdx, charIdx) {
      if (!this.interactive || !this.isCellSelectable(font, sectionIdx, charIdx)) {
        return;
      }

      this.handleCellClick(font, sectionIdx, charIdx);
    },
    handleCellClick(font, sectionIdx, charIdx) {
      const section = font.sections[sectionIdx];
      const runeChar = this.getCellDisplay(font, sectionIdx, charIdx);

      if (runeChar === '/') {
        return;
      }

      this.$emit('select-character', {
        fontKey: font.key,
        fontLabel: font.label,
        fontFamily: font.font,
        plainChar: section.header[charIdx],
        runeChar
      });
    }
  }
};
</script>

<style scoped>
.witch-font-all-table {
  margin-bottom: 2rem;
  background: rgba(45, 19, 59, 0.92);
  border: 1px solid rgba(238, 183, 225, 0.28);
  border-radius: 18px;
  padding: 1.2rem 0.8rem 1.5rem;
  max-width: 100vw;
  box-sizing: border-box;
}

.witch-font-all-table.compact {
  margin-bottom: 0;
  padding: 1rem 0.5rem;
}

.witch-font-info {
  text-align: left;
  color: #e9d6f7;
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 1.2rem;
  padding: 1rem 1.1rem;
  background: rgba(25, 14, 35, 0.85);
  border-radius: 14px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.witch-font-info h2 {
  margin-top: 0;
}

.witch-font-info a {
  color: #f3d5ff;
}

.witch-font-all-table-container {
  width: 100%;
}

.table-hint {
  margin: 0 0 1rem;
  color: #f5d7ff;
  font-family: 'Segoe UI', Arial, sans-serif;
  text-align: left;
}

.table-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wikitable {
  border-collapse: collapse;
  width: 100%;
  background: rgba(35, 22, 46, 0.95);
  font-size: 1rem;
  color: #e9d6f7;
  table-layout: fixed;
}

th,
td {
  border: 1px solid #5d4733;
  padding: 0.5rem 0.35rem;
  text-align: center;
  word-break: break-all;
  overflow-wrap: break-word;
}

th {
  background: #806f54;
  color: #f7e6f7;
  font-family: 'Segoe UI', Arial, sans-serif !important;
  font-weight: 700;
  text-shadow: 0 1px 8px #3a392d;
  min-width: 2.5rem;
}

tbody td {
  background: #8c7c6d;
  color: #f8ecff;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

tbody tr:hover td {
  background: #6b5d53;
}

td.selectable {
  padding: 0;
  cursor: pointer;
}

td.selectable:hover {
  background: #70538a;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
}

.rune-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3.1rem;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

h2 {
  color: #eeb7e1;
  text-shadow: 0 2px 12px #2d133b;
  font-family: 'Segoe UI', Arial, sans-serif;
  margin: 0 0 1rem;
}

@media (max-width: 900px) {
  .wikitable {
    font-size: 0.85rem;
  }

  th,
  td {
    padding: 0.3rem 0.2rem;
  }

  tbody td,
  .rune-button {
    font-size: 1.3rem !important;
    min-height: 2.3rem;
  }
}

@media (max-width: 600px) {
  .witch-font-all-table {
    padding: 0.8rem 0.3rem 1rem;
  }

  .witch-font-info {
    font-size: 0.85rem;
    line-height: 1.5;
    padding: 0.8rem;
  }

  .wikitable {
    font-size: 0.65rem;
  }

  th,
  td {
    padding: 0.15rem 0.1rem;
  }

  tbody td,
  .rune-button {
    font-size: 0.95rem !important;
    min-height: 1.7rem;
  }
}
</style>
