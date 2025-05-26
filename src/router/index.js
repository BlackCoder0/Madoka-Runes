import { createRouter, createWebHistory } from 'vue-router';
import WitchFontAllTable from '../components/WitchFontAllTable.vue';
import WitchFontConverter from '../components/WitchFontConverter.vue';
import WitchMap from '../components/WitchMap.vue';

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
meta: { backgroundImage: 'bg_onair.jpg' , backgroundSize: 'cover' }
}
];

const router = createRouter({
history: createWebHistory(),
routes
});

export default router;