import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';

Vue.use(Vuex);

export const STORAGE_KEY = 'tasks';

const localStoragePlugin = store =>
  store.subscribe((mutation, { tasks }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  });

// fixme: completed and failed should be stored?
export default new Vuex.Store({
  state: {
    completed: 0,
    failed: 0,
    tasks: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'),
  },
  mutations,
  actions: {
    // addTodo ({ commit }, task) {
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
