export const WORK_INTERVAL_COMPLETED = '@TIMER/WORK_INTERVAL_COMPLETED';
export const WORK_INTERVAL_INTERRUPTED = '@TIMER/WORK_INTERVAL_INTERRUPTED';
export const WORK_ADD_TASK = '@TIMER/WORK_ADD_TASK';
export const SETTINGS_UPDATE = '@SETTINGS/UPDATE';

export default {
  [WORK_INTERVAL_INTERRUPTED](state) {
    state.failed += 1;
  },

  [WORK_INTERVAL_COMPLETED](state) {
    state.completed += 1;
  },

  [WORK_ADD_TASK](state, task) {
    state.tasks.push(task);
  },

  [SETTINGS_UPDATE](state, setting) {
    state.settings = {
      ...state.settings,
      ...setting,
    };
  },
};
