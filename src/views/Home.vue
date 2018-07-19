<template>
  <div>
    <Timer :completedCount="completedCount"
           :failedCount="failedCount"
           :targetCount="targetCount" />

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
    targetCount() {
      return this.$store.state.settings.target;
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
