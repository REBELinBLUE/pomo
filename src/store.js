import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const STORAGE_KEY = 'tasks';
export const WORK_INTERVAL_COMPLETED = '@TIMER/WORK_INTERVAL_COMPLETED';
export const WORK_INTERVAL_INTERRUPTED = '@TIMER/WORK_INTERVAL_INTERRUPTED';

const DEFAULT = JSON.stringify([
  {
    id: 1,
    date: Date.now(),
    description: 'BOR-1234',
    status: 'success',
    time: 25 * 60,
    notes: null,
  },
  {
    id: 2,
    date: Date.now(),
    description: 'BOR-7672',
    status: 'failed',
    time: 6.5 * 60,
    notes: 'Interrupted by someone',
  },
]);

const localStoragePlugin = store =>
  store.subscribe((mutation, { tasks }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  });

export default new Vuex.Store({
  state: {
    completed: 0,
    failed: 0,
    tasks: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || DEFAULT),
  },
  mutations: {
    [WORK_INTERVAL_INTERRUPTED]() {
      this.state.failed = this.state.failed + 1;
    },
    [WORK_INTERVAL_COMPLETED]() {
      this.state.completed = this.state.completed + 1;
    },
    // addTodo (state, todo) {
    //   state.todos.push(todo)
    // },
    //
    // removeTodo (state, todo) {
    //   state.todos.splice(state.todos.indexOf(todo), 1)
    // },
    //
    // editTodo (state, { todo, text = todo.text, done = todo.done }) {
    //   todo.text = text
    //   todo.done = done
    // }
  },
  actions: {
    // addTodo ({ commit }, text) {
    //   commit('addTodo', {
    //     text,
    //     done: false
    //   })
    // },
    //
    // removeTodo ({ commit }, todo) {
    //   commit('removeTodo', todo)
    // },
    //
    // toggleTodo ({ commit }, todo) {
    //   commit('editTodo', { todo, done: !todo.done })
    // },
    //
    // editTodo ({ commit }, { todo, value }) {
    //   commit('editTodo', { todo, text: value })
    // },
    //
    // toggleAll ({ state, commit }, done) {
    //   state.todos.forEach((todo) => {
    //     commit('editTodo', { todo, done })
    //   })
    // },
    //
    // clearCompleted ({ state, commit }) {
    //   state.todos.filter(todo => todo.done)
    //     .forEach(todo => {
    //       commit('removeTodo', todo)
    //     })
    // }
  },
  plugins: [localStoragePlugin],
});
