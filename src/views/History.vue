<template>
  <TaskList :tasks="tasks" title="Past Activity" empty-message="You have not started any tasks before today." />
</template>

<script>
// FIXME: Should have a prop on this which is the current date which causes the reload when it changes
import { mapActions } from 'vuex';
import { LOAD_OLD_TASKS } from '@/store/constants';
import TaskList from '@/components/TaskList/TaskList.vue';

export default {
  name: 'History',
  components: {
    TaskList,
  },
  computed: {
    tasks() { return this.$store.state.tasks.old; },
    // tasks() {
    //   const { tasks } = this.$store.state;
    //   const today = dateFormat(new Date(), 'isoDate');
    //
    //   return tasks
    //     .filter(task => dateFormat(new Date(task.date), 'isoDate') !== today)
    //     .sort((a, b) => {
    //       const firstDate = new Date(a.date);
    //       const secondDate = new Date(b.date);
    //
    //       if (firstDate > secondDate) {
    //         return 1;
    //       }
    //
    //       if (firstDate < secondDate) {
    //         return -1;
    //       }
    //
    //       return 0;
    //     });
    // },
  },
  beforeMount() {
    this.loadTasks();
  },
  methods: {
    ...mapActions({
      loadTasks: LOAD_OLD_TASKS,
    }),
  },
};
</script>
