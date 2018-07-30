<template>
  <!-- FIXME: Improve message -->
  <TaskList :tasks="tasks" title="Past Activity" empty-message="You have not started any tasks yet." />
</template>

<script>
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
