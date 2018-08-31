// Local storage keys
export const SETTINGS_STORAGE_KEY = 'pomodoro:settings';

// Settings mutations
export const SETTINGS_UPDATE = '@SETTINGS/UPDATE';

// Timer mutations
export const TIMER_START = '@TIMER/START';
export const TIMER_STOP = '@TIMER/STOP';
export const TIMER_TICK = '@TIMER/TICK';
export const TIMER_RESET = '@TIMER/RESET';
export const TIMER_PAUSE = '@TIMER/PAUSE';

// Task mutations and actions
export const SET_CURRENT_TASK = '@TASKS/SET_CURRENT';
export const ADD_TASK = '@TASKS/SAVE';
export const LOAD_CURRENT_TASKS = '@TASKS/LOAD_CURRENT';
export const LOAD_OLD_TASKS = '@TASKS/LOAD_OLD';

// Light mutations
export const DEVICE_DISCOVERED = '@BTLE/DEVICE_DISCOVERED';
export const DEVICE_PAIRED = '@BTLE/DEVICE_PAIRED';
export const DEVICE_UNPAIRED = '@BTLE/DEVICE_UNPAIRED';
export const DEVICE_CONNECTED = '@BTLE/CONNECTED';
export const DEVICE_DISCONNECTED = '@BTLE/DISCONNECTED';
