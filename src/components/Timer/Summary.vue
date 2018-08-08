<template>
  <div>
    <vs-chip vs-color="success" vs-icon="check_circle">
      Completed: {{ completed }} / {{ target }}
    </vs-chip>
    <vs-chip vs-color="danger" vs-icon="error">
      Interruptions: {{ failed }}
    </vs-chip>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Summary',
  computed: mapState({
    completed: state => state.tasks.completed,
    failed: state => state.tasks.failed,
    target: state => state.settings.target,
  }),
};
</script>

<style scoped lang="scss">
.con-vs-chip {
  margin: 0 0 0 10px !important;
  font-weight: bolder;
}
div {
  text-align: center;
}
</style>
