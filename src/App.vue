<template>
  <div class="container">
    <nav class="main-nav">
      <router-link to="/">古代体</router-link>
      <router-link to="/modern">现代体</router-link>
      <router-link to="/musical">音乐体</router-link>
      <router-link to="/convert">转换工具</router-link>
      <router-link to="/ocr">OCR识别</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@font-face {
  font-family: 'MadokaLetters';
  src: url('/ttf/MadokaLetters.ttf');
}
@font-face {
  font-family: 'MadokaMusical';
  src: url('/ttf/MadokaMusical.ttf');
}
@font-face {
  font-family: 'MadokaRunes';
  src: url('/ttf/MadokaRunes.ttf');
}
@font-face {
  font-family: 'MadokaRunes-2.0';
  src: url('/ttf/MadokaRunes-2.0.ttf');
}
@font-face {
  font-family: 'nkf10_magicum_comicum_crassum';
  src: url('/ttf/nkf10_magicum_comicum_crassum.ttf');
}
@font-face {
  font-family: 'nkf11_magicum_texturae';
  src: url('/ttf/nkf11_magicum_texturae.ttf');
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(20, 10, 30, 0.92);
  border-radius: 18px;
  box-shadow: 0 4px 24px #2d133b, 0 0 0 8px #1a0e23 inset;
}
.main-nav {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #2d133b 0%, #4e2a5a 100%);
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  box-shadow: 0 2px 12px #1a0e23;
  border: 1.5px solid #a084c7;
}
.main-nav a {
  color: #eeb7e1;
  text-shadow: 0 1px 8px #2d133b;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: color 0.2s, background 0.2s;
  padding: 0.2rem 0.7rem;
  border-radius: 6px;
}
.main-nav a.router-link-exact-active {
  color: #fff;
  background: linear-gradient(90deg, #a084c7 0%, #eeb7e1 100%);
  border-radius: 6px;
  box-shadow: 0 0 8px #a084c7;
}
body {
  background: linear-gradient(135deg, #1a0e23 0%, #2d133b 100%);
  font-family: 'MadokaLetters', 'MadokaMusical', 'MadokaRunes', 'nkf10_magicum_comicum_crassum', 'nkf11_magicum_texturae', Arial, sans-serif;
  margin: 0;
  padding: 0;
  color: #f3e6fa;
}
</style>
