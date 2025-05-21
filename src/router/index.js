import { createRouter, createWebHistory } from 'vue-router';
import WitchFontTable from '../components/WitchFontTable.vue';
import WitchFontConverter from '../components/WitchFontConverter.vue';
import WitchFontOCR from '../components/WitchFontOCR.vue';

const routes = [
  {
    path: '/',
    name: 'FontTable',
    component: WitchFontTable,
    props: { title: '魔女文字字符集（古代体）', fontFamily: 'MadokaRunes' }
  },
  {
    path: '/modern',
    name: 'FontTableModern',
    component: WitchFontTable,
    props: { title: '魔女文字字符集（现代体）', fontFamily: 'MadokaRunes-2.0' }
  },
  {
    path: '/musical',
    name: 'FontTableMusical',
    component: WitchFontTable,
    props: { title: '魔女文字字符集（音乐体）', fontFamily: 'MadokaMusical' }
  },
  {
    path: '/convert',
    name: 'FontConverter',
    component: WitchFontConverter
  },
  {
    path: '/ocr',
    name: 'FontOCR',
    component: WitchFontOCR
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;