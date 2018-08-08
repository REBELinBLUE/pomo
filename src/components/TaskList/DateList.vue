<template>
  <vs-list>
    <vs-list-header vs-title="Past Activity" vs-color="success" vs-icon="assignment" />

    <template v-if="hasTasks">
      <Date v-for="(date, index) in dates" :date="date" :tasks="tasksForDate(date)" :index="index" :key="index" />
    </template>

    <vs-list-item v-else :vs-title="emptyMessage" />
  </vs-list>
</template>

<script>
import Date from '@/components/TaskList/Date.vue';

export default {
  name: 'DateList',
  components: {
    Date,
  },
  props: {
    emptyMessage: {
      type: String,
      default: 'There are no tasks',
    },
    tasks: {
      type: Array,
      default: () => [],
    },
    dates: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    hasTasks() {
      return this.dates.length > 0;
    },
  },
  methods: {
    tasksForDate(date) {
      return this.tasks.filter((task) => {
        const timestamp = task.date.setHours(0, 0, 0, 0);
        const foo = date.setHours(0, 0, 0, 0);

        return timestamp === foo;
      });
    },
  },
};
</script>
