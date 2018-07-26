<template>
  <vs-row>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
      <radial-progress-bar :completed-steps="completed"
                           :total-steps="total"
                           :animate-speed="500"
                           :stroke-width="9"
                           :diameter="350"
                           :inner-stroke-color="completedColor"
                           :start-color="remainingColor"
                           :stop-color="remainingColor">
        <slot />
      </radial-progress-bar>
    </vs-col>
  </vs-row>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress';

export default {
  name: 'Progress',
  components: {
    RadialProgressBar,
  },
  props: {
    remainingColor: {
      type: String,
      required: true,
    },
    completedColor: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: false,
      default: 100,
    },
    completed: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>

<style>
/* fixme: this should be scoped */
.radial-progress-container {
  margin: 20px;
}
</style>
