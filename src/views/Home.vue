<template>
  <div>
    <Timer :completedCount="completedCount"
           :failedCount="failedCount"
           :targetCount="targetCount"
           :intervalLength="intervalLength"
           :restLength="restLength"
           :longRestLength="longRestLength"
           :longRestFrequency="longRestFrequency"
    />

    <TaskList :tasks="tasks"
              emptyMessage="You have not started any tasks today." />
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
