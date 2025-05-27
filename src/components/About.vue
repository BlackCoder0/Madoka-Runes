<template>
  <div class="about-page">
    <section class="about-section">
      <h3>引用</h3>
      <ul>
        <li><a href="https://zh.moegirl.org.cn/Mainpage#" target="_blank">萌娘百科</a></li>
        <li><a href="https://magireco.moe/wiki/%E9%A6%96%E9%A1%B5" target="_blank">魔法纪录中文Wiki</a></li>
        <li><a href="https://tieba.baidu.com/p/4525882479?pn=5#" target="_blank">百度贴吧</a></li>
        <li><a href="https://wiki.biligame.com/pcr/%E9%A6%96%E9%A1%B5" target="_blank">公主连结BWIKI</a></li>
      </ul>
    </section>
    <section class="about-section">
      <h3>备注</h3>
      <ol>
        <li>本页面的古代文/现代文字体使用的是 MadokaRunes（2.0属实不知道怎么用），部分字符有缺失。</li>
        <li>见泷原地图参考和引用游戏《魔法少女小圆 携带版》剧情，所展示信息仅包含TV版《魔法少女小圆》的最后一周目。</li>
        <li>尚需解决的地点问题（以下均为TV内容）：
  <ul>
    <li>第2集：巴麻美用缎带救下路人的废墟楼</li>
    <li>第3集：黑暗的魔女（Suleika）的使魔出现地点</li>
    <li>第8集：开头的巴士站</li>
    <li>第9集：佐仓杏子牺牲处</li>
    <li>第11集：魔女之夜出现地点</li>
  </ul>
</li>
      </ol>
    </section>
    <section class="about-section">
      <h3>我的信息</h3>
      <ul>
        <li>GitHub: <a href="https://github.com/BlackCoder0/Madoka-Runes" target="_blank"> BlackCoder0：Madoka-Runes</a></li>
        <li>邮箱: <a href="mailto:2943984952@email.com">@Code</a></li>
      </ul>
    </section>
    <section class="about-section proverb-section">
      <blockquote class="proverb">Dont' forget<br>
Always somewhere<br>
someone is fighting for you<br>
——As long as you remember her<br>
you are not along</blockquote>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about-page {
  max-width: 700px;
  margin: 40px auto;
  background: rgba(255,255,255,0.92);
  border-radius: 16px;
  box-shadow: 0 4px 24px #2d133b22;
  padding: 32px 24px 24px 24px;
  font-size: 1.1rem;
  color: #2d133b;
}


.about-section {
  margin-bottom: 2.2em;
  text-align: left;
  font-family: 'Time New Roman','serif';
}
.about-section h3 {
  color: #7c3aed;
  margin-bottom: 0.5em;
  text-align: center;
}
.ul, .ol {
  margin-left: 1.5em;
}

.proverb-section {
  text-align: center;
}
.proverb {
  display: inline-block;
  font-family: 'Time New Roman','serif';
  font-size: 1.5rem;
  color: #545652;
  background: #98877d;
  padding: 1.2em 2em;
  border: 2px solid #000000;
  border-radius: 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  margin-top: 2em;
  position: relative;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
.proverb:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: 'Time New Roman','serif';
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%237c3aed' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.3;
}
@media (max-width: 768px) {
  .about-page {
    margin: 30% 5px;
    padding: 0px 0px;
    font-size: 1rem;
  }
  
  .about-section {
    margin-bottom: 1.5em;
    margin-left: -0.5em;
  }
  .ul, .ol {
  margin-left: -0.5em;
}
  .proverb {
    font-size: 0.9rem;
    padding: 1em 1em;
    margin-top: 1em;
  }
}
</style>