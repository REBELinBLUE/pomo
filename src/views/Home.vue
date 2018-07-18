<template>
  <div>
    <vs-row>
      <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
        <Timer :completedCount="completedCount"
               :failedCount="failedCount"
               :targetCount="targetCount" />
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
        <TaskList :tasks="tasks" />
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import Timer from '@/components/Timer/Timer.vue';
import TaskList from '@/components/TaskList/TaskList.vue';

export default {
  name: 'home',
  components: {
    Timer,
    TaskList,
  },
  computed: {
    tasks() {
      const { tasks } = this.$store.state;
      const today = (new Date()).setUTCHours(0, 0, 0, 0);

      return tasks.filter((task) => {
        const date = (new Date(task.date)).setUTCHours(0, 0, 0, 0);
        return (date === today);
      }).sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        }

        if (a.date > b.date) {
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
