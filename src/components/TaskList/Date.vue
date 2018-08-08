<template>
  <div>
    <vs-list-item :vs-title="readable" v-on:click.native="visible = !visible">
      <vs-chip vs-color="success" vs-icon="check_circle">{{ completed }}</vs-chip>
      <vs-chip vs-color="danger" vs-icon="error">{{ interrupted }}</vs-chip>
    </vs-list-item>
    <Task v-if="visible" v-for="(task, index) in tasks" :item="task" :index="index" :key="index" />
    <vs-divider />
  </div>
</template>

<script>
  import dateFormat from 'dateformat';
  import Task from '@/components/TaskList/Task.vue';

  export default {
    name: 'Date',
    components: {
      Task
    },
    data: () => ({
      visible: false,
    }),
    props: {
      date: {
        type: Date,
        required: true,
      },
      tasks: {
        type: Array,
        default: [],
      }
    },
    computed: {
      readable() {
        return dateFormat(this.date, 'dS mmmm yyyy');
      },
      completed() {
        return this.tasks.reduce((accumlator, task) => {
          if (!task.interrupted) {
            accumlator += 1;
          }

          return accumlator;
        }, 0);
      },
      interrupted() {
        return this.tasks.length - this.completed;
      },
    },
  };
</script>

<style scoped lang="scss">
  div {
    cursor: pointer !important;
  }
.vs-list-item {
  min-height: 15px;
  cursor: pointer !important;

  /deep/ .list-title,
  /deep/ .list-subtitle {
    cursor: pointer !important;
  }
}

.vs-divider {
  margin: 0px;
}
span {
  padding-right: 20px;
}
</style>
