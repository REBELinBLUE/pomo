<template>
  <vs-input v-model="innerValue" class="task-name" vs-icon="alarm" placeholder="Enter task name..." />
</template>

<script>
export default {
  name: 'TaskName',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
    innerValue(val) {
      this.$emit('input', val);
    },
  },
};
</script>

<!-- FIXME: Should be able to add scoped -->
<style lang="scss">
.task-name.vs-input {
  width: 100%;
}
</style>
