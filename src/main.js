import Vue from 'vue';
import Vuesax from 'vuesax';
import { MdTable } from 'vue-material/dist/components';
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
import 'vue-material/dist/vue-material.min.css';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Vuesax);
Vue.use(MdTable);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
