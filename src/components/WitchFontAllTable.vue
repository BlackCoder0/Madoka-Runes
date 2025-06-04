<template>
  <div class="witch-font-all-table">

    <div class="witch-font-all-table-container">
      <div class="witch-font-info">
        <p><strong>魔女文字</strong>（<strong>Madoka
            Runes</strong>，又称<strong>犬咖喱文</strong>）是指出现于SHAFT制作的动画《魔法少女小圆》中魔女结界、魔法少女戒指等处的文字，由剧团犬咖喱设计。</p>

        <p>魔女文字的字符与拉丁字母（包括德文字母，比英文字母多出4个）和阿拉伯数字之间存在一一对应。</p>

        <p>剧中出现的魔女文字大多用来拼写德文和英文，也有用来拼写日语罗马字、意大利语、拉丁语等其他语言的。</p>

        <p>魔女文字的破译是圆粉们的一大乐趣。不过在剧情设定中魔女文字实际上是无法被解读的，因此剧中人物是以"oo的魔女"来称呼魔女们。</p>

      </div>
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
                <td v-for="(char, charIdx) in section.header" :key="char" :style="getCellStyle(font, char)">
                  {{ getCellDisplay(font, charIdx, font.sections[sectionIdx]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="witch-font-info">
      <h2>字体</h2>
        <p>魔女文字在剧中出现的字体主要有三种（注意字体名称并非官方命名，只是爱好者取的名字）：</p>
        <ol>
          <li><strong>古代体</strong>（Archaic），字形较为复杂，多有棱角和粗细变化，在原作中最常见。（在字体文件中，原字体大写字母对应该风格）</li>
          <li><strong>现代体</strong>（Modern），字形较为简略流畅。（在字体文件中，原字体小写字母对应该风格）</li>
          <li><strong>音乐体</strong>（Musical），许多笔画类似乐谱和音符，主要出现于人鱼魔女的结界中，在其他地方也有零散出现。</li>
        </ol>
      <p>本站目前使用<a href="https://tieba.baidu.com/home/main?id=tb.1.df458a65.pThF7AVtjtVtywlkzrvvHg?t=1586141278&fr=pb" target="_blank">somlibaria</a>制作的<a href="https://tieba.baidu.com/p/4525882479?pn=5#" target="_blank">魔女文字体资源</a>，其中包括：</p>
      <ul>
        <li>MadokaRunes Archaic（古代体）</li>
        <li>MadokaRunes Modern（现代体）</li>
        <li>MadokaMusical（音乐体）</li>
        <li>MadokaLetters（哥特体）</li>
        <li>Magicum Texturae（黑花体）</li>
        <li>Magicum Comicum Crassum（圆体）</li>
      </ul>
    </div>
  </div>
</template>

<script>
  const fontMap = [
    {
      label: '古代体',
      font: 'MadokaRunes2',
      key: 'ancient',
      sections: [
        { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], characters: 'ABCDEFGHIJ' },
        { header: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], characters: 'KLMNOPQRST' },
        { header: ['U', 'V', 'W', 'X', 'Y', 'Z', 'Ä', 'Ö', 'Ü', 'ß'], characters: 'UVWXYZÄÖÜß' },
        { header: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], characters: '0123456789' }
      ]
    },
    {
      label: '现代体',
      font: 'MadokaRunes2',
      key: 'modern',
      sections: [
        { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], characters: 'ABCDEFGHIJ' },
        { header: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], characters: 'KLMNOPQRST' },
        { header: ['U', 'V', 'W', 'X', 'Y', 'Z', 'Ä', 'Ö', 'Ü', 'ß'], characters: 'U/W/YZÄÖÜß' },
        { header: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], characters: '0123456789' }
      ]
    },
    {
      label: '音乐体',
      font: 'MadokaMusical',
      key: 'musical',
      sections: [
        { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], characters: 'ABCDEFGHI/' },
        { header: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], characters: 'KLMNOP/RST' },
        { header: ['U', 'V', 'W', 'X', 'Y', 'Z', 'Ä', 'Ö', 'Ü', 'ß'], characters: 'UV//YZ////' },
        { header: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], characters: '//////////' }
      ]
    },
    {
      label: '哥特体',
      font: 'nkf11_magicum_texturae',
      key: 'GETE',
      sections: [
        { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], characters: 'ABCDEFGHIJ' },
        { header: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'], characters: 'KLMNOPQRST' },
        { header: ['U', 'V', 'W', 'X', 'Y', 'Z', 'Ä', 'Ö', 'Ü', 'ß'], characters: 'UVWXYZÄÖÜß' },
        { header: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], characters: '0123456789' }
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
  body {
    background-image: url('/assets/555.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  .witch-font-info {
    text-align: left;
    color: #e9d6f7;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    padding: 0.5rem 1rem;
    background: #23162e;
    font-family: 'Segoe UI', 'Arial', sans-serif;
  }

  .witch-font-all-table-container {
    width: 100%;
  }

  .table-sections {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    /* Add space between table sections */
  }

  .witch-font-all-table {
    margin-bottom: 2rem;
    background: #2d133b;
    border-radius: 14px;
    /* box-shadow: 0 2px 16px #634d3f, 0 0 0 4px #634d3f inset; */
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
    table-layout: fixed;
    /* Fixed layout for better column control */
    width: 100%;
  }

  th,
  td {
    border: 1px solid #5d4733;
    padding: 0.5rem 0.5rem;
    text-align: center;
    word-break: break-all;
    overflow-wrap: break-word;
  }

  th {
    background: #806f54;
    color: #f7e6f7;
    font-family: 'Segoe UI', 'Arial', sans-serif !important;
    font-weight: bold;
    text-shadow: 0 1px 8px #3a392d;
    min-width: 2.5rem;
  }

  tbody th {
    background: #806f54;
    color: #f7e6f7;
    font-family: 'Segoe UI', 'Arial', sans-serif !important;
    font-weight: bold;
    text-shadow: 0 1px 8px #00000044;
    min-width: 2.5rem;
  }

  tbody td {
    background: #8c7c6d;
    color: #e9d6f7;
    transition: background 0.2s;
    font-size: 2rem;
  }

  tbody tr:hover td {
    background: #575753;
  }

  h2 {
    color: #eeb7e1;
    text-shadow: 0 2px 12px #2d133b;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    margin-bottom: 1.2rem;
  }

  @media (max-width: 900px) {
    .witch-font-all-table-container {
      margin-top: 30%;
    }

    .wikitable {
      font-size: 0.85rem;
    }

    th,
    td {
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
    .witch-font-info {
      font-size: 0.75rem;
      line-height: 1.2;
      margin-bottom: 1rem;
      padding: 0.5rem 1rem;
    }

    .witch-font-all-table-container {
      margin-top: 30%;
    }

    .wikitable {
      font-size: 0.65rem;
    }

    th,
    td {
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