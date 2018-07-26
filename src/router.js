import Vue from 'vue';
import Router from 'vue-router';
import Timer from './views/Timer.vue';
import Settings from './views/Settings.vue';
import History from './views/History.vue';
import About from './views/About.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Timer,
    },
    {
      path: '/history',
      name: 'history',
      component: History,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
  ],
});
