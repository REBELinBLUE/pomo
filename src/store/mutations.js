import { WORK_ADD_TASK, SETTINGS_UPDATE } from './constants';

export default {
  [WORK_ADD_TASK](state, task) {
    state.tasks.push(task);
  },

  [SETTINGS_UPDATE](state, settings) {
    state.settings = {
      ...state.settings,
      ...settings,
    };
  },
};
