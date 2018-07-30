import { ADD_TASK, LOAD_CURRENT_TASKS, LOAD_OLD_TASKS } from './constants';
import db, { Task } from '../db';

export default {
  [ADD_TASK]({ commit }, payload) {
    const task = new Task({
      date: new Date(Date.now()),
      interrupted: false,
      notes: null,
      ...payload,
    });

    task.save()
      .then(() => { commit(ADD_TASK, task); });
  },

  [LOAD_CURRENT_TASKS]({ commit }) {
    const todayStart = (new Date()).setHours(0, 0, 0);
    const todayFinish = (new Date()).setHours(23, 59, 59);

    db.tasks
      .where('date')
      .between(new Date(todayStart), new Date(todayFinish))
      .reverse()
      .toArray()
      .then((tasks) => { commit(LOAD_CURRENT_TASKS, tasks); });
  },

  [LOAD_OLD_TASKS]({ commit }) {
    const todayStart = (new Date()).setHours(0, 0, 0);
    db.tasks
      .where('date')
      .below(new Date(todayStart))
      .toArray()
      .then((tasks) => { commit(LOAD_OLD_TASKS, tasks); });
  },

  /*
    [LOAD_OLD_TASKS]({ commit }) {
    const todayStart = (new Date()).setHours(0, 0, 0);
    db.tasks
      .where('date')
      .below(new Date(todayStart))
      .toArray()
      .then((tasks) => {
        const dates = tasks.reduce((acc, task) => {
          // FIXME: shouldn't task.date.setHours(0, 0, 0) be enough?
          acc.push(dateFormat(task.date.setHours(0, 0, 0), 'isoDateTime'));

          return acc;
        }, []).sort((a, b) => {
          const firstDate = new Date(a);
          const secondDate = new Date(b);
          if (firstDate < secondDate) {
            return 1;
          }
          if (firstDate > secondDate) {
            return -1;
          }
          return 0;
        });

        const unique = [...new Set(dates)];

        commit(LOAD_OLD_TASKS, unique); // fixme: action name is wrong
      });
   */
};
