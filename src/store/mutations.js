import dateFormat from 'dateformat';
import { WORK_ADD_TASK, SETTINGS_UPDATE } from './constants';

export default {
  [WORK_ADD_TASK](state, task) {
    state.tasks.push({
      date: dateFormat(new Date(), 'isoDateTime'),
      interrupted: false,
      // description: undefined,
      // time: undefined,
      notes: null,
      ...task,
    });
  },

  [SETTINGS_UPDATE](state, settings) {
    state.settings = {
      ...state.settings,
      ...settings,
    };
  },


};
