import { SETTINGS_STORAGE_KEY } from './constants';

const localStoragePlugin = store =>
  store.subscribe((mutation, { settings }) => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  });

export default [localStoragePlugin];

// export default process.env.NODE_ENV !== 'test'
//   ? [localStoragePlugin]
//   : [];
