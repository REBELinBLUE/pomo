<template>
  <vs-list>
    <vs-list-header :vs-title="title" vs-color="success" vs-icon="assignment" />

    <template v-if="hasTasks">
      <Task v-for="(task, index) in tasks" :item="task" :index="index" :key="index" />
    </template>
    <vs-list-item v-else :vs-title="emptyMessage" />

    <json-excel v-if="hasTasks" id="export" :data="tasks" :fields="fields" :name="filename" type="csv">
      <vs-button vs-color="success"
                 vs-type="filled"
                 vs-icon="archive"
                 vs-size="medium"
                 accesskey="d">Export as a CSV file</vs-button>
    </json-excel>
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
    title: {
      type: String,
      default: 'Activity',
    },
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
  margin-top: 10px;
  float: right;
}
</style>
