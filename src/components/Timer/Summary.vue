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
export default {
  name: 'Summary',
  props: {
    failed: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      default: 10,
    },
  },
};
</script>

<style scoped>
.con-vs-chip {
  margin: 0 !important;
  font-weight: bolder;
}
</style>
