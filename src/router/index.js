import { createRouter, createWebHistory } from 'vue-router';
import WitchFontAllTable from '../components/WitchFontAllTable.vue';
import WitchFontConverter from '../components/WitchFontConverter.vue';
import WitchFontOCR from '../components/WitchFontOCR.vue';

const routes = [
  {
    path: '/',
    name: 'FontAllTable',
    component: WitchFontAllTable
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