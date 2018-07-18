import zeroPad from './zeroPad';

export default {
  install(Vue) {
    Vue.filter('zeroPad', zeroPad);
  },
};
