import { ADD_TASK, SETTINGS_UPDATE, LOAD_TODAYS_TASKS, LOAD_OLD_TASKS } from './constants';

export default {
  [ADD_TASK](state, task) {
    state.tasks.today.push(task);
  },

  [LOAD_TODAYS_TASKS](state, tasks) {
    state.tasks.today = tasks;
  },

  [LOAD_OLD_TASKS](state, tasks) {
    state.tasks.old = tasks;
  },

  [SETTINGS_UPDATE](state, settings) {
    state.settings = {
      ...state.settings,
      ...settings,
    };
  },
};
