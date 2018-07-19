import { TASKS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './constants';

const localStoragePlugin = store =>
  store.subscribe((mutation, { tasks, settings }) => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  });

export default [localStoragePlugin];

// export default process.env.NODE_ENV !== 'test'
//   ? [localStoragePlugin]
//   : [];
