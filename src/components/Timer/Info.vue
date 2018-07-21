<template>
  <vs-row id="stats">
    <vs-col vs-type="flex" vs-justify="flex-start" vs-align="center" :vs-w="colWidth">
      <h2>{{ label }}</h2>
    </vs-col>

    <vs-col v-if="!resting" vs-type="flex" vs-justify="center" vs-align="center" :vs-w="colWidth">
      <vs-input vs-icon="alarm" placeholder="Enter task name..." v-model="innerValue" />
    </vs-col>

    <vs-col vs-type="flex" vs-justify="flex-end" vs-align="center" :vs-w="colWidth">
      <Summary :completed="completed" :target="target" :failed="failed" />
    </vs-col>
  </vs-row>
</template>

<script>
import Summary from '@/components/Timer/Summary.vue';

export default {
  name: 'Info',
  components: {
    Summary,
  },
  props: {
    label: String,
    currentTask: String,
    resting: Boolean,
    completed: Number,
    target: Number,
    failed: Number,
    value: String,
  },
  computed: {
    colWidth() {
      return this.resting ? 6 : 4;
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

<style scoped lang="scss">
#stats {
  margin-top: 10px;
}
</style>
