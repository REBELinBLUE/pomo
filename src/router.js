import Vue from 'vue';
import Router from 'vue-router';
import Timer from './views/Timer.vue';
import Settings from './views/Settings.vue';
import History from './views/History.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Timer,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/history',
      name: 'history',
      component: History,
    },
  ],
});
