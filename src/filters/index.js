import zeroPad from './zeroPad';
import minutesRemaining from './minutesRemaining';
import secondsRemaining from './secondsRemaining';

export default {
  install(Vue) {
    Vue.filter('zeroPad', zeroPad);
    Vue.filter('minutesRemaining', minutesRemaining);
    Vue.filter('secondsRemaining', secondsRemaining);
  },
};
