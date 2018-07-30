import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import plugins from './plugins';
import { SETTINGS_STORAGE_KEY } from './constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: {
      today: [],
      old: [],
    },
    settings: JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || JSON.stringify({
      interval: 25,
      rest: 5,
      long_rest: 15,
      long_rest_after: 4,
      target: 10,
      autostart: false,
      interval_alarm: true,
      break_alarm: true,
    })),
  },
  plugins,
  mutations,
  actions,
});
