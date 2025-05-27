import { createRouter, createWebHashHistory } from 'vue-router';
// ⬆️ 改为 createWebHashHistory

import WitchFontAllTable from '../components/WitchFontAllTable.vue';
import WitchFontConverter from '../components/WitchFontConverter.vue';
import WitchMap from '../components/WitchMap.vue';
import About from '../components/About.vue';

const routes = [
  {
    path: '/',
    name: 'FontAllTable',
    component: WitchFontAllTable,
    meta: { backgroundImage: '555.png', backgroundSize: 'cover' }
  },
  {
    path: '/convert',
    name: 'FontConverter',
    component: WitchFontConverter,
    meta: { backgroundImage: 'mqdefault.jpg', backgroundSize: 'cover' }
  },
  {
    path: '/map',
    name: 'Map',
    component: WitchMap,
    meta: { backgroundImage: 'bg_onair.jpg', backgroundSize: 'cover' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { backgroundImage: 'ph_kv3.jpg', backgroundSize: 'cover' }
  }
];

const router = createRouter({
  history: createWebHashHistory(), // ✅ 使用 hash 模式
  routes
});

export default router;
