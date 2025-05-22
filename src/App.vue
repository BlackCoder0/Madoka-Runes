<template>
  <div class="app-layout">
    <nav class="main-nav">
      <div class="nav-logo-area">
        <router-link to="/" class="logo-link">
          <img src="/vite.svg" alt="Logo" class="nav-logo" />
        </router-link>
      </div>
      <div class="nav-links">
        <router-link to="/" exact>魔女文</router-link>
        <router-link to="/convert">转换工具</router-link>
        <router-link to="/ocr">OCR识别</router-link>
      </div>
    </nav>
    <div class="main-content">
      <router-view />
    </div>
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
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a0e23 0%, #2d133b 100%);
}
.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  min-width: 0;
  gap: 0;
  background: linear-gradient(90deg, #2d133b 0%, #4e2a5a 100%);
  border-radius: 0 0 12px 12px;
  padding: 0.7rem 2.2rem 0.7rem 1.2rem;
  box-shadow: 0 2px 12px #1a0e23;
  border: 1.5px solid #a084c7;
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-logo-area {
  display: flex;
  align-items: center;
  min-width: 120px;
  margin-right: 2.5rem;
}
.nav-logo {
  height: 2.2rem;
  width: auto;
  vertical-align: middle;
  cursor: pointer;
}
.logo-link {
  display: flex;
  align-items: center;
}
.nav-links {
  display: flex;
  gap: 1.2rem;
  flex: 1 1 auto;
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
  margin: 0 0.1rem;
}
.main-nav a.router-link-exact-active, .main-nav a.router-link-active {
  color: #fff;
  background: linear-gradient(90deg, #a084c7 0%, #eeb7e1 100%);
  border-radius: 6px;
  box-shadow: 0 0 8px #a084c7;
}
@media (max-width: 900px) {
  .main-nav {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  }
  .nav-logo-area {
    margin-right: 0.8rem;
    margin-bottom: 0.5rem;
  }
  .nav-links {
    gap: 0.7rem;
  }
}
.main-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem 2rem 1rem;
  background: rgba(20, 10, 30, 0.92);
  border-radius: 18px;
  box-shadow: 0 4px 24px #2d133b, 0 0 0 8px #1a0e23 inset;
}
body {
  background: linear-gradient(135deg, #1a0e23 0%, #2d133b 100%);
  font-family: 'MadokaLetters', 'MadokaMusical', 'MadokaRunes', 'nkf10_magicum_comicum_crassum', 'nkf11_magicum_texturae', Arial, sans-serif;
  margin: 0;
  padding: 0;
  color: #f3e6fa;
}
@media (max-width: 900px) {
  .main-content {
    padding: 1rem 0.2rem 1rem 0.2rem;
    max-width: 100vw;
  }
  .main-nav {
    font-size: 0.95rem;
    padding: 0.5rem 0.5rem;
  }
}
@media (max-width: 600px) {
  .main-content {
    padding: 0.2rem 0.05rem 0.5rem 0.05rem;
    border-radius: 0;
  }
  .main-nav {
    font-size: 0.8rem;
    padding: 0.3rem 0.2rem;
    border-radius: 0 0 8px 8px;
  }
}
</style>
