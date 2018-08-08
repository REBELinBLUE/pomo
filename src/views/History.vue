<template>
  <DateList
    :tasks="tasks"
    :dates="dates"
    empty-message="You have not started any tasks before today."
  />
</template>

<script>
// FIXME: Should have a prop on this which is the current date which causes the reload when it changes
import { mapActions, mapState } from 'vuex';
import { LOAD_OLD_TASKS } from '@/store/constants';
import DateList from '@/components/TaskList/DateList.vue';

export default {
  name: 'History',
  components: {
    DateList,
  },
  computed: mapState({

    // map -> each obj.date.setHours -> [...timestampts]
    // reduce with include
    // map to convert date to the obj
    tasks: state => state.tasks.old,
    dates: state => state.tasks.old.reduce((accumulator, task) => {
      const timestamp = task.date.setHours(0, 0, 0, 0);

      if (!accumulator.includes(timestamp)) {
        accumulator.push(timestamp);
      }

      return accumulator;
    }, []).reduce((accumlator, timestamp) => {
      accumlator.push(new Date(timestamp));

      return accumlator;
    }, []).sort((firstDate, secondDate) => firstDate - secondDate),
  }),
  beforeMount() {
    this.loadTasks();
  },
  methods: mapActions({
    loadTasks: LOAD_OLD_TASKS,
  }),
};
</script>
