<template>
  <vs-row>
    <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
      <vs-card>
        <vs-card-header vs-background-color="primary"
                        vs-title="Tasks"
                        vs-icon="alarm"
                        :vs-fill="true" />
        <vs-card-body v-if="hasTasks">
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
        <vs-card-body v-else>
          {{ emptyMessage }}
        </vs-card-body>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import TableHead from '@/components/TaskList/TableHead.vue';
import Task from '@/components/TaskList/Task.vue';

export default {
  name: 'TaskList',
  components: {
    TableHead,
    Task,
  },
  props: {
    emptyMessage: {
      type: String,
      default: () => 'There are no tasks',
    },
    tasks: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    hasTasks() {
      return this.tasks.length > 0;
    },
  },
};
</script>
