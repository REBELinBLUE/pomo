<template>
      <vs-list>
        <json-excel id="export" v-if="hasTasks" :data="tasks" :fields="fields" type="csv" :name="filename">
          <vs-button vs-color="success"
                     vs-type="filled"
                     vs-icon="cloud_download"
                     vs-size="medium"
                     accesskey="d">Export (.csv)</vs-button>
        </json-excel>

        <vs-list-header vs-icon="alarm" vs-title="Activity" vs-color="success" />

        <template v-if="hasTasks">
          <!-- FIXME: Show date in the history view -->
          <Task v-for="(task, index) in tasks" :item="task" :index="index" :key="index" />
        </template>
        <vs-list-item v-else :vs-title="emptyMessage" />
      </vs-list>
</template>

<script>
import dateFormat from 'dateformat';
import JsonExcel from 'vue-json-excel/JsonExcel.vue';
import Task from '@/components/TaskList/Task.vue';

export default {
  name: 'TaskList',
  components: {
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
        // Time: 'time',
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

<style lang="scss">
#export {
  position: absolute;
  right: 20px;
  margin-top: 12px;
  z-index: 1000;
}
</style>
