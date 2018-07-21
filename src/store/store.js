import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import plugins from './plugins';
import { TASKS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: JSON.parse(window.localStorage.getItem(TASKS_STORAGE_KEY) || '[]'),
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
  actions: { }, // TODO: Change to use actions rather than mutations
});
