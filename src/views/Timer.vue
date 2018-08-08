<template>
  <div>
    <Display @timerskip="skipped" @timerinterrupt="interrupted" @timerreset="reset" />
    <TaskList :tasks="tasks" title="Today's Activity" empty-message="You have not started any tasks today." />
  </div>
</template>

<script>
// FIXME: Should have a prop on this which is the current date which causes the reload when it changes
import { mapActions, mapState } from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line
import { LOAD_CURRENT_TASKS } from '@/store/constants';
import Display from '@/components/Timer/Display.vue';
import TaskList from '@/components/TaskList/TaskList.vue';

export default {
  name: 'Home',
  components: {
    Display,
    TaskList,
  },
  computed: mapState({
    tasks: state => state.tasks.today.sort((firstDate, secondDate) => secondDate - firstDate),
  }),
  beforeMount() {
    this.loadTasks();
  },
  methods: {
    ...mapActions({
      loadTasks: LOAD_CURRENT_TASKS,
    }),
    skipped(payload) { // FIXME: Figure out some way to not include these when running outside of electron
      ipcRenderer.send('timer-skipped', payload);
    },
    interrupted(payload) {
      ipcRenderer.send('timer-interrupted', payload);
    },
    reset(payload) {
      ipcRenderer.send('timer-reset', payload);
    },
  },
};
</script>

<style scoped lang="scss">
.vs-list {
  margin-top: 10px;
}
</style>
