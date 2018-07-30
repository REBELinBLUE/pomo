import { ADD_TASK, LOAD_TODAYS_TASKS, LOAD_OLD_TASKS } from './constants';
import db from '../db';

export default {
  [ADD_TASK]({ commit }, payload) {
    const task = {
      date: new Date(Date.now()),
      interrupted: false,
      // description: undefined,
      // time: undefined,
      notes: null,
      ...payload,
    };

    db.tasks
      .put(task)
      .then(() => { commit(ADD_TASK, task); })
      .catch(console.error);
  },

  [LOAD_TODAYS_TASKS]({ commit }) {
    const todayStart = (new Date()).setHours(0, 0, 0);
    const todayFinish = (new Date()).setHours(23, 59, 59);

    db.tasks
      .where('date')
      .between(new Date(todayStart), new Date(todayFinish))
      .reverse()
      .toArray()
      .then((tasks) => { commit(LOAD_TODAYS_TASKS, tasks); })
      .catch(console.error);
  },

  [LOAD_OLD_TASKS]({ commit }) {
    const todayStart = (new Date()).setHours(0, 0, 0);
    db.tasks
      .where('date')
      .below(new Date(todayStart))
      .toArray()
      .then((tasks) => { commit(LOAD_OLD_TASKS, tasks); })
      .catch(console.error);
  },
};
