<template>
  <div>
    <label>{{ label }}</label>
    <vs-select v-model="innerValue">
      <vs-select-item :key="index" :vs-value="item.value" :vs-text="item.text" v-for="(item, index) in options" />
    </vs-select>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    label: String,
    value: Number,
    options: Array,
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
