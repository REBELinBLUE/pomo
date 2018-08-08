import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import plugins from './plugins';
import { SETTINGS_STORAGE_KEY } from './constants';

Vue.use(Vuex);

// FIXME: Move to modules
export default new Vuex.Store({
  state: {
    timer: {
      is_counting: false,
      is_working: true,
      is_long_break: false,
      length: 0,
      remaining: 0,
      counter: 0,
    },
    tasks: {
      current: null,
      completed: -1,
      failed: 0,
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
