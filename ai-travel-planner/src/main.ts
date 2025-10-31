import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import BaiduMap from 'vue-baidu-map-3x';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ElementPlus);

app.use(BaiduMap, {
  ak: import.meta.env.VITE_BAIDU_MAP_AK,
});

app.mount('#app');
