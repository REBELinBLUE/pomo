<template>
  <div>
    <label>{{ label }}</label>
    <vs-input v-model="innerValue" />
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    label: String,
    value: String,
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

<style scoped lang="scss">
div {
  clear: right;

  margin: {
    right: 2px;
    bottom: 10px;
  }

  .vs-input {
    float: right;
  }
}
</style>
