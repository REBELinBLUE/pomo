import {
  ADD_TASK,
  SET_CURRENT_TASK,
  SETTINGS_UPDATE,
  LOAD_CURRENT_TASKS,
  LOAD_OLD_TASKS,
  TIMER_START,
  TIMER_STOP,
  TIMER_TICK,
  TIMER_RESET,
  TIMER_PAUSE,
  DEVICE_CONNECTED,
  DEVICE_DISCONNECTED,
  DEVICE_DISCOVERED,
  DEVICE_PAIRED,
  DEVICE_UNPAIRED,
} from './constants';

export default {
  [DEVICE_CONNECTED](state) {
    state.light = {
      devices: {},
      connected: true,
    };
  },

  [DEVICE_DISCONNECTED](state) {
    state.light = {
      devices: {},
      connected: false,
    };
  },

  [DEVICE_DISCOVERED](state, devices) {
    state.light = {
      devices,
      connected: false,
    };
  },

  [DEVICE_PAIRED](state, device) {
    state.settings.device = device;

    state.light = {
      ...state.light,
      devices: {},
    };
  },

  [DEVICE_UNPAIRED](state) {
    state.settings.device = null;

    state.light = {
      connected: false,
      devices: {},
    };
  },

  [TIMER_RESET](state, payload) {
    state.timer = {
      ...state.timer,
      is_counting: false,
      length: payload.length,
      remaining: payload.length,
      counter: 0,
    };
  },

  [TIMER_START](state) {
    state.timer = {
      ...state.timer,
      is_counting: true,
    };
  },

  [TIMER_PAUSE](state) {
    state.timer = {
      ...state.timer,
      is_counting: false,
    };
  },

  [TIMER_STOP](state, payload) {
    state.timer = {
      ...state.timer,
      ...payload,
      is_counting: false,
    };
  },

  [TIMER_TICK](state, payload) {
    state.timer = {
      ...state.timer,
      ...payload,
      remaining: state.timer.length - payload.counter,
    };
  },

  [SET_CURRENT_TASK](state, taskName) {
    state.tasks.current = taskName;
  },

  [ADD_TASK](state, task) {
    if (task.interrupted) {
      state.tasks.failed += 1;
    } else {
      state.tasks.completed += 1;
    }

    state.timer.is_long_break = state.tasks.completed % state.settings.long_rest_after === 0;

    state.tasks.today.unshift(task);
  },

  [LOAD_CURRENT_TASKS](state, tasks) {
    const completed = tasks.reduce((accumulator, task) => {
      if (!task.interrupted) {
        return accumulator + 1;
      }

      return accumulator;
    }, 0);

    const failed = tasks.reduce((accumulator, task) => {
      if (task.interrupted) {
        return accumulator + 1;
      }

      return accumulator;
    }, 0);

    // state.timer.is_long_break = completed % state.settings.long_rest_after === 0;

    state.tasks = {
      ...state.tasks,
      today: tasks,
      completed,
      failed,
    };
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
