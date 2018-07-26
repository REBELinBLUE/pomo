<template>
  <div>
    <label>{{ label }}</label>
    <vs-select v-model="innerValue">
      <vs-select-item v-for="(item, index) in options" :key="index" :vs-value="item.value" :vs-text="item.text" />
    </vs-select>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    options: {
      type: Array,
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
      this.innerValue = parseInt(val, 10);
    },
    innerValue(val) {
      this.$emit('input', parseInt(val, 10));
    },
  },
  beforeDestroy() {
    // FIXME: This is due to a bug in vuesax
    this.$children[0].$refs.vsSelectOptions.remove();
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

  .con-select {
    float: right;
  }
}
</style>
