<template>
  <TaskList :tasks="tasks"
            emptyMessage="You have not started any tasks yet." />
</template>

<script>
import dateFormat from 'dateformat';
import TaskList from '@/components/TaskList/TaskList.vue';

export default {
  name: 'History',
  components: {
    TaskList,
  },
  computed: {
    tasks() {
      const { tasks } = this.$store.state;
      const today = dateFormat(new Date(), 'isoDate');

      return tasks
        .filter(task => dateFormat(new Date(task.date), 'isoDate') !== today)
        .sort((a, b) => {
          const firstDate = new Date(a.date);
          const secondDate = new Date(b.date);

          if (firstDate > secondDate) {
            return 1;
          }

          if (firstDate < secondDate) {
            return -1;
          }

          return 0;
        });
    },
  },
};
</script>
