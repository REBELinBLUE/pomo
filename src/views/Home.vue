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
    />

    <TaskList :tasks="tasks"
              empty-message="You have not started any tasks today." />
  </div>
</template>

<script>
import dateFormat from 'dateformat';
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
    tasks() {
      const { tasks } = this.$store.state;
      const today = dateFormat(new Date(), 'isoDate');

      return tasks
        .filter(task => dateFormat(new Date(task.date), 'isoDate') === today)
        .sort((a, b) => {
          const firstDate = new Date(a.date);
          const secondDate = new Date(b.date);

          if (firstDate < secondDate) {
            return 1;
          }

          if (firstDate > secondDate) {
            return -1;
          }

          return 0;
        });
    },
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
};
</script>
