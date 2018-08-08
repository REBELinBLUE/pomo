<template>
  <vs-row>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
      <vs-button v-if="stopped"
                 vs-color="success"
                 vs-type="filled"
                 vs-icon="play_arrow"
                 vs-size="large"
                 accesskey="s"
                 @click="onStart">Start countdown</vs-button>

      <vs-button v-if="running"
                 vs-color="danger"
                 vs-type="filled"
                 vs-icon="warning"
                 vs-size="large"
                 accesskey="i"
                 @click="onInterrupt">Work interruption</vs-button>

      <vs-button v-if="resting"
                 vs-color="success"
                 vs-type="filled"
                 vs-icon="skip_next"
                 vs-size="large"
                 accesskey="k"
                 @click="onSkip">Skip rest break</vs-button>
    </vs-col>
  </vs-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Actions',
  props: {
    onStart: {
      type: Function,
      required: true,
    },
    onInterrupt: {
      type: Function,
      required: true,
    },
    onSkip: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState({
      stopped: state => !state.timer.is_counting,
      running: state => state.timer.is_working && state.timer.is_counting,
      resting: state => !state.timer.is_working,
    }),
  },
};
</script>

<style scoped lang="scss">
.vs-button {
  margin: 2px;
}
</style>
