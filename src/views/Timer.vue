<template>
  <div>
    <Timer :completed-count="completedCount"
           :failed-count="failedCount"
           :target-count="targetCount"
           :interval-length="intervalLength"
           :rest-length="restLength"
           :long-rest-length="longRestLength"
           :long-rest-frequency="longRestFrequency"
           :auto-start="autoStart"
           :interval-alarm="intervalAlarm"
           :break-alarm="breakAlarm"
           v-on:timerstart="started"
           v-on:timerstop="stopped"
           v-on:timerskip="skipped"
           v-on:timerinterrupt="interrupted"
           v-on:timerprogress="progress"
           v-on:timercreated="init"
           v-on:timerreset="init"
    />

    <TaskList :tasks="tasks" title="Today's Activity" empty-message="You have not started any tasks today." />
  </div>
</template>

<script>
// FIXME: Should have a prop on this which is the current date which causes the reload when it changes
import { mapActions } from 'vuex';
import { ipcRenderer } from 'electron'; // eslint-disable-line
import { LOAD_CURRENT_TASKS } from '@/store/constants';
import Timer from '@/components/Timer/Timer.vue';
import TaskList from '@/components/TaskList/TaskList.vue';

export default {
  name: 'Home',
  components: {
    Timer,
    TaskList,
  },
  computed: {
    targetCount() { return this.$store.state.settings.target; },
    intervalLength() { return this.$store.state.settings.interval; },
    restLength() { return this.$store.state.settings.rest; },
    longRestLength() { return this.$store.state.settings.long_rest; },
    longRestFrequency() { return this.$store.state.settings.long_rest_after; },
    autoStart() { return this.$store.state.settings.autostart; },
    intervalAlarm() { return this.$store.state.settings.interval_alarm; },
    breakAlarm() { return this.$store.state.settings.break_alarm; },
    tasks() { return this.$store.state.tasks.today; },
    completedCount() {
      return this.tasks.reduce((accumulator, task) => {
        if (!task.interrupted) {
          return accumulator + 1;
        }

        return accumulator;
      }, 0);
    },
    failedCount() {
      return this.tasks.reduce((accumulator, task) => {
        if (task.interrupted) {
          return accumulator + 1;
        }

        return accumulator;
      }, 0);
    },
  },
  beforeMount() {
    this.loadTasks();
  },
  methods: {
    ...mapActions({
      loadTasks: LOAD_CURRENT_TASKS,
    }),
    started(payload) { // FIXME: Figure out some way to not include these when running outside of electron
      ipcRenderer.send('timer-started', payload);
    },
    init(payload) {
      ipcRenderer.send('timer-init', payload);
    },
    skipped(payload) {
      ipcRenderer.send('timer-skipped', payload);
    },
    stopped(payload) {
      ipcRenderer.send('timer-stopped', payload);
    },
    interrupted(payload) {
      ipcRenderer.send('timer-interrupted', payload);
    },
    progress(payload) {
      ipcRenderer.send('timer-progress', payload);
    },
  },
};
</script>

<style scoped lang="scss">
.vs-list {
  margin-top: 10px;
}
</style>
