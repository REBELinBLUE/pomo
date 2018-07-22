<template>
  <div>
    <label>{{ label }}</label>
    <vs-switch v-model="innerValue" />
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  props: {
    label: String,
    value: Boolean,
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  watch: {
    value(val) {
      this.innerValue = !!val;
    },
    innerValue(val) {
      this.$emit('input', !!val);
    },
  },
};
</script>

<style scoped lang="scss">
div {
  clear: right;

  margin: {
    right: 2px;
    bottom: 10px;
  }

  .vs-switch {
    float: right;
  }
}
</style>
