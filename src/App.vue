<template>
  <div>
    <div id="body-container">
      <nav class="main-nav nav-full-width">
        <div class="nav-container">
          <div class="nav-logo-area">
            <router-link to="/" class="logo-link">
              <img src="/logo/white_on_trans.png" alt="Logo" class="nav-logo" />
              &nbsp;&nbsp;Madoka Runes
            </router-link>
          </div>
          <div class="nav-links">
            <router-link to="/" exact>魔女文</router-link>
            <router-link to="/convert">转换工具</router-link>
            <router-link to="/map">见泷原</router-link>
<router-link to="/about">关于</router-link>
          </div>
        </div>
      </nav>
      <div class="app-layout">
        <div class="main-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      updateBodyBackground() {
        const backgroundImage = this.$route.meta.backgroundImage;
        const backgroundSize = this.$route.meta.backgroundSize || 'cover'; // 默认为 cover

        if (backgroundImage) {
          document.body.style.backgroundImage = `url('/src/assets/${backgroundImage}')`;
          document.body.style.backgroundSize = backgroundSize;
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundPosition = 'center center';
          document.body.style.minHeight = '100vh';
          document.body.style.width = '100vw';
        } else {
          // 如果当前路由没有设置背景图，则清除body上的背景样式
          document.body.style.backgroundImage = '';
          document.body.style.backgroundSize = '';
          document.body.style.backgroundRepeat = '';
          document.body.style.backgroundPosition = '';
          document.body.style.minHeight = '';
          document.body.style.width = '';
        }
      }
    },
    watch: {
      $route: 'updateBodyBackground' // 监听路由变化，调用更新背景的方法
    },
    mounted() {
      this.updateBodyBackground(); // 组件挂载时设置初始背景
    },
    beforeUnmount() {
      // 在组件卸载前清除body上的背景样式，避免影响其他页面或组件
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundPosition = '';
      document.body.style.minHeight = '';
      document.body.style.width = '';
    }
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

  body {
    font-family: 'MadokaLetters', 'MadokaMusical', 'MadokaRunes', 'nkf10_magicum_comicum_crassum', 'nkf11_magicum_texturae', Arial, sans-serif;
    margin: 0;
    padding: 0;
    color: #f3e6fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-layout {
    max-width: 100vw;
    width: 100%;
    margin: 0 auto;
    padding-top: 10%;
    /* padding:2rem 1rem 2rem 1rem; */
    background: transparent;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .main-nav {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    background: linear-gradient(90deg, #2d133b 0%, #4e2a5a 100%);
    border: 1.5px solid #a084c7;
    position: sticky;
    top: 0;
    z-index: 10;
    left: 0;
    right: 0;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    margin-bottom: 0;
    padding-left: max(0px, calc(50vw - 50%));
    padding-right: max(0px, calc(50vw - 50%));
  }

  .nav-full-width {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 1002;
    box-sizing: border-box;
    padding: 12px 20px;
    background: linear-gradient(90deg, #2d133b 0%, #4e2a5a 100%);
    transition: transform 0.3s ease;
    gap: 10px;
  }

  .nav-container {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.7rem 2.2rem 0.7rem 1.2rem;
  }

  .nav-logo-area {
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
    /* 调整 logo 右侧间距 */
  }

  .nav-logo {
    height: 3.6rem;
    /* 调整 logo 高度 */
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
    gap: 1rem;
    /* 调整链接间距 */
    align-items: center;
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

  .main-nav .nav-links a.router-link-exact-active,
  .main-nav .nav-links a.router-link-active {
    color: #fff;
    background: linear-gradient(90deg, #a084c7 0%, #eeb7e1 100%);
    border-radius: 6px;
    box-shadow: 0 0 8px #a084c7;
  }

  .logo-link {
    font-family: Arial, sans-serif;
  }

  @media (max-width: 900px) {
    .main-nav.nav-full-width {
      padding: 8px 4px;
    }

    .main-nav {
      flex-direction: column;
      align-items: flex-start;
      padding: 0.5rem 0.5rem;
    }

    .nav-container {
      flex-direction: column;
      align-items: flex-start;
      max-width: 100vw;
      width: 100%;
      margin: 0 auto;
    }

    .nav-logo-area {
      margin-right: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .nav-links {
      gap: 0.7rem;
      align-items: flex-start;
    }
  }

  .main-content {
    justify-content: flex-start;
    align-items: stretch;
  }

  body {
    background: linear-gradient(135deg, #1a0e23 0%, #2d133b 100%);
    font-family: 'MadokaLetters', 'MadokaMusical', 'MadokaRunes', 'nkf10_magicum_comicum_crassum', 'nkf11_magicum_texturae', Arial, sans-serif;
    margin: 0;
    padding: 0;
    color: #f3e6fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 900px) {
    .main-nav.nav-full-width {
      padding: 8px 4px;
    }

    .app-layout {
      max-width: 100vw;
      width: 100%;
      margin: 0 auto;
      /* padding: 1rem 0.2rem 1rem 0.2rem; */
      max-width: 100vw;
    }

    .main-nav {
      font-size: 0.95rem;
      padding: 0.5rem 0.5rem;
    }
  }

  @media (max-width: 600px) {
    .app-layout {
      max-width: 100vw;
      width: 100%;
      margin: 0 auto;
      /* padding: 0.2rem 0.05rem 0.5rem 0.05rem; */
      border-radius: 0;
    }

    .main-nav {
      font-size: 0.8rem;
      padding: 0.3rem 0.2rem;
      border-radius: 0 0 8px 8px;
    }
  }
</style>