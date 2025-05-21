<template>
  <div class="witch-font-table">
    <h2>{{ title }}</h2>
    <table>
      <thead>
        <tr>
          <th v-for="char in header" :key="char">{{ char }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="char in header" :key="char" :style="{fontFamily: fontFamily, fontSize: '2rem'}">{{ char }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'WitchFontTable',
  props: {
    title: { type: String, required: true },
    fontFamily: { type: String, required: true }
  },
  data() {
    return {
      header: [
        'A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O','o','P','p','Q','q','R','r','S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z','0','1','2','3','4','5','6','7','8','9','Ä','ä','Ö','ö','Ü','ü','ẞ','ß'
      ]
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