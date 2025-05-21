<template>
  <div class="witch-font-table">
    <h2>魔女文字三体字符对照表</h2>
    <table>
      <thead>
        <tr>
          <th>字符</th>
          <th>古代体</th>
          <th>现代体</th>
          <th>音乐体</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="char in header" :key="char">
          <td>{{ char }}</td>
          <td :style="{fontFamily: 'MadokaRunes', fontSize: '2rem'}">{{ fontSupport['MadokaRunes'][char] ? char : '/' }}</td>
          <td :style="{fontFamily: 'MadokaRunes-2.0', fontSize: '2rem'}">{{ fontSupport['MadokaRunes-2.0'][char] ? char : '/' }}</td>
          <td :style="{fontFamily: 'MadokaMusical', fontSize: '2rem'}">{{ fontSupport['MadokaMusical'][char] ? char : '/' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
function checkFontSupport(font, char) {
  // 利用canvas检测字体是否支持该字符
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `40px ${font},monospace`;
  const baseline = ctx.measureText('A').width;
  const width = ctx.measureText(char).width;
  return width !== baseline;
}

export default {
  name: 'WitchFontTable',
  data() {
    return {
      header: [
        'A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r','S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z','0','1','2','3','4','5','6','7','8','9','Ä','ä','Ö','ö','Ü','ü','ẞ','ß'
      ],
      fontSupport: {
        'MadokaRunes': {},
        'MadokaRunes-2.0': {},
        'MadokaMusical': {}
      }
    }
  },
  mounted() {
    // 检查每种字体对每个字符的支持情况
    for (const font of ['MadokaRunes','MadokaRunes-2.0','MadokaMusical']) {
      for (const char of this.header) {
        this.$set(this.fontSupport[font], char, checkFontSupport(font, char));
      }
    }
  }
}
</script>

<style scoped>
.witch-font-table {
  margin-bottom: 2rem;
}
table {
  border-collapse: collapse;
  width: 100%;
  background: #fff7fa;
}
th, td {
  border: 1px solid #e0e0e0;
  padding: 0.5rem 0.7rem;
  text-align: center;
}
th {
  background: #f7e6f7;
}
</style>