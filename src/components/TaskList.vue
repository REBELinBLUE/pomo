<template>
  <vs-card>
    <vs-card-header vs-background-color="primary"
                    vs-title="Tasks"
                    vs-icon="alarm"
                    :vs-fill="true" />
    <vs-card-body>
      <vs-row>
        <TableHead size="1">Date</TableHead>
        <TableHead size="3">Description</TableHead>
        <TableHead size="1">Time</TableHead>
        <TableHead size="2">Status</TableHead>
        <TableHead size="5">Notes</TableHead>
      </vs-row>
      <vs-divider/>
      <Task v-for="(task, index) in tasks"
            :item="task"
            :index="index"
            :key="index" />
    </vs-card-body>
  </vs-card>
</template>

<script>
import TableHead from '@/components/TableHead.vue';
import Task from '@/components/Task.vue';

export default {
  name: 'TaskList',
  computed: {
    tasks() {
      return this.$store.state.tasks.reverse();
    },
  },
  components: {
    TableHead,
    Task,
  },
};
</script>
