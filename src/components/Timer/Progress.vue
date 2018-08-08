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
import { mapState } from 'vuex';
import RadialProgressBar from 'vue-radial-progress';

export default {
  name: 'Progress',
  components: {
    RadialProgressBar,
  },
  computed: {
    ...mapState({
      completed: state => state.timer.remaining,
      total: state => state.timer.length,
      isWorking: state => state.timer.is_working,
    }),
    remainingColor() {
      if (this.isWorking) {
        return 'rgb(255, 71, 87)';
      }

      return 'rgb(109, 198, 81)';
    },
    completedColor() {
      if (this.isWorking) {
        return 'rgb(251, 223, 223)';
      }

      return 'rgb(227, 244, 221)';
    },
  },
};
</script>

<style lang="scss">
/* fixme: this should be scoped */
.radial-progress-container {
  margin: 20px;
}
</style>
