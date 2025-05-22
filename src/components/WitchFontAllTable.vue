<template>
  <div class="witch-font-all-table-container">
    <div class="witch-font-all-table">
      <h2>魔女文字字符集总览</h2>
      <div class="table-sections">
        <div v-for="(section, sectionIdx) in fontMap[0].sections" :key="sectionIdx">
            <table class="wikitable">
                <thead>
                <tr>
                    <th rowspan="2">字体/字符</th>
                    <th v-for="char in section.header" :key="char">{{ char }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="font in fontMap" :key="font.key">
                    <th>{{ font.label }}</th>
                    <td
                    v-for="(char, charIdx) in section.header"
                    :key="char"
                    :style="getCellStyle(font, char)"
                    >
                    {{ getCellDisplay(font, charIdx, font.sections[sectionIdx]) }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
const fontMap = [
  {
    label: '古代体',
    font: 'MadokaRunes',
    key: 'ancient',
    sections: [
      { header: ['A','B','C','D','E','F','G','H','I','J'], characters: 'ABCDEFGHIJ' },
      { header: ['K','L','M','N','O','P','Q','R','S','T'], characters: 'KLMNOPQRST' },
      { header: ['U','V','W','X','Y','Z','Ä','Ö','Ü','ß'], characters: 'UVWXYZÄÖÜß' },
      { header: ['0','1','2','3','4','5','6','7','8','9'], characters: '0123456789' }
    ]
  },
  {
    label: '现代体',
    font: 'MadokaRunes',
    key: 'modern',
    sections: [
      { header: ['A','B','C','D','E','F','G','H','I','J'], characters: 'ABCDE/GHIJ' },
      { header: ['K','L','M','N','O','P','Q','R','S','T'], characters: 'KLMNOP/RST' },
      { header: ['U','V','W','X','Y','Z','Ä','Ö','Ü','ß'], characters: 'U/////ÄÖÜß' },
      { header: ['0','1','2','3','4','5','6','7','8','9'], characters: '0123456789' }
    ]
  },
  {
    label: '音乐体',
    font: 'MadokaMusical',
    key: 'musical',
    sections: [
      { header: ['A','B','C','D','E','F','G','H','I','J'], characters: 'ABCDEFGHI/' },
      { header: ['K','L','M','N','O','P','Q','R','S','T'], characters: 'KLMNOP/RST' },
      { header: ['U','V','W','X','Y','Z','Ä','Ö','Ü','ß'], characters: 'UV//YZ////' },
      { header: ['0','1','2','3','4','5','6','7','8','9'], characters: '//////////' }
    ]
  },
  {
    label: '哥特体',
    font: 'nkf11_magicum_texturae',
    key: 'GETE',
    sections: [
      { header: ['A','B','C','D','E','F','G','H','I','J'], characters: 'ABCDEFGHIJ' },
      { header: ['K','L','M','N','O','P','Q','R','S','T'], characters: 'KLMNOPQRST' },
      { header: ['U','V','W','X','Y','Z','Ä','Ö','Ü','ß'], characters: 'UVWXYZÄÖÜß' },
      { header: ['0','1','2','3','4','5','6','7','8','9'], characters: '0123456789' }
    ]
  }
];

export default {
  name: 'WitchFontAllTable',
  data() {
    return {
      fontMap
    };
  },
  methods: {
    getCellDisplay(font, charIdx, section) {
    const char = section.header[charIdx];
    const displayChar = section.characters?.[charIdx];

    if (!displayChar || displayChar === ' ') {
        return '/';
    }

    // 格式化逻辑
    if (font.key === 'modern') return displayChar.toLowerCase();
    if (font.key === 'ancient') return displayChar.toUpperCase();
    return displayChar;
    },
    getCellStyle(font, char, characters) {
      return {
        fontFamily: font.font,
        fontSize: '2rem'
      };
    }
  }
};
</script>

<style scoped>
.witch-font-all-table-container {
  width: 100%;
}
.table-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Add space between table sections */
}
.witch-font-all-table {
  margin-bottom: 2rem;
  background: #1a1023;
  border-radius: 14px;
  box-shadow: 0 2px 16px #2d133b, 0 0 0 4px #2d133b inset;
  padding: 1.2rem 0.5rem 1.5rem 0.5rem;
  min-width: 0;
  max-width: 100vw;
}
.wikitable {
  border-collapse: collapse;
  width: 100%;
  background: #23162e;
  font-size: 1rem;
  color: #e9d6f7;
  table-layout: fixed; /* Fixed layout for better column control */
  width: 100%;
}
th, td {
  border: 1px solid #3a2547;
  padding: 0.5rem 0.5rem;
  text-align: center;
  word-break: break-all;
  overflow-wrap: break-word;
}
th {
  background: #2d133b;
  color: #f7e6f7;
  font-family: 'Segoe UI', 'Arial', sans-serif !important;
  font-weight: bold;
  text-shadow: 0 1px 8px #00000044;
  min-width: 2.5rem;
}
tbody th {
  background: #2d133b;
  color: #f7e6f7;
  font-family: 'Segoe UI', 'Arial', sans-serif !important;
  font-weight: bold;
  text-shadow: 0 1px 8px #00000044;
  min-width: 2.5rem;
}
tbody td {
  background: #23162e;
  color: #e9d6f7;
  transition: background 0.2s;
  font-size: 2rem;
}
tbody tr:hover td {
  background: #3a2547;
}
h2 {
  color: #eeb7e1;
  text-shadow: 0 2px 12px #2d133b;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  margin-bottom: 1.2rem;
}
@media (max-width: 900px) {
  .wikitable {
    font-size: 0.85rem;
  }
  th, td {
    padding: 0.3rem 0.2rem;
  }
  .witch-font-all-table {
    padding: 0.5rem 0.1rem 1rem 0.1rem;
  }
  tbody td {
    font-size: 1.3rem !important;
  }
}
@media (max-width: 600px) {
  .wikitable {
    font-size: 0.65rem;
  }
  th, td {
    padding: 0.15rem 0.1rem;
  }
  .witch-font-all-table {
    padding: 0.2rem 0.05rem 0.5rem 0.05rem;
  }
  tbody td {
    font-size: 0.85rem !important;
  }
}
</style>
  

