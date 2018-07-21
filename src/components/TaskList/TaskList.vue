<template>
  <vs-row>
    <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
      <vs-card>
        <vs-card-header vs-background-color="primary"
                        vs-title="Tasks"
                        vs-icon="alarm"
                        :vs-fill="true">
          <json-excel v-if="hasTasks" :data="tasks" :fields="fields" type="csv" :name="filename">
            <vs-button vs-color="success"
                       vs-type="filled"
                       vs-icon="cloud_download"
                       vs-size="medium"
                       accesskey="d">Download (.csv)</vs-button>
          </json-excel>
        </vs-card-header>

        <vs-card-body v-if="hasTasks">
          <vs-row>
            <TableHead size="1">Date</TableHead>
            <TableHead size="3">Description</TableHead>
            <TableHead size="1">Time</TableHead>
            <TableHead size="2">Status</TableHead>
            <TableHead size="5">Notes</TableHead>
          </vs-row>

          <vs-divider vs-color="primary" />

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
import dateFormat from 'dateformat';
import JsonExcel from 'vue-json-excel/JsonExcel.vue';
import TableHead from '@/components/TaskList/TableHead.vue';
import Task from '@/components/TaskList/Task.vue';

export default {
  name: 'TaskList',
  components: {
    TableHead,
    Task,
    JsonExcel,
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
  },
  data() {
    return {
      filename: `tasks-${dateFormat(new Date(), 'isoDate')}.csv`,
      fields: {
        Date: {
          field: 'date',
          callback: value => dateFormat(value, 'dd/mm/yy'),
        },
        Description: 'description',
        //Time: 'time',
        Completed: {
          field: 'interrupted',
          callback: value => (value ? 'No' : 'Yes'),
        },
        Reason: {
          field: 'notes',
          callback: value => (value === null ? '' : value),
        },
      },
    };
  },
  computed: {
    hasTasks() {
      return this.tasks.length > 0;
    },
  },
};
</script>

<!-- FIXME: Add scoped -->
<style lang="scss">
.con-vs-card-header {
  .vs-button {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
