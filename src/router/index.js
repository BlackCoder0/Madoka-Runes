import { createRouter, createWebHistory } from 'vue-router';
import WitchFontAllTable from '../components/WitchFontAllTable.vue';
import WitchFontConverter from '../components/WitchFontConverter.vue';
import WitchMap from '../components/WitchMap.vue';

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
    path: '/map',
    name: 'Map',
    component: WitchMap
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;