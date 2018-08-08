<template>
  <vs-input :value="task" class="task-name" vs-icon="alarm" placeholder="Enter task name..." @input="updateTask" />
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { SET_CURRENT_TASK } from '@/store/constants';

export default {
  name: 'TaskName',
  props: {
    label: { // FIXME: Placeholder isn't working due to a bug in vuesax
      type: String,
      required: false,
      default: '',
    },
  },
  computed: mapState({
    task: state => state.tasks.current,
  }),
  methods: mapMutations({
    updateTask: SET_CURRENT_TASK,
  }),
};
</script>

<!-- FIXME: Should be able to add scoped -->
<style lang="scss">
.task-name.vs-input {
  width: 100%;
}
</style>
