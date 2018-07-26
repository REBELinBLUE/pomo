<template>
  <vs-row>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
      <vs-button v-if="stopped"
                 vs-color="success"
                 vs-type="filled"
                 vs-icon="play_arrow"
                 vs-size="large"
                 accesskey="s"
                 v-on:click="onStart">Start countdown</vs-button>

      <vs-button v-if="running"
                 vs-color="danger"
                 vs-type="filled"
                 vs-icon="warning"
                 vs-size="large"
                 accesskey="i"
                 v-on:click="onInterrupt">Work interruption</vs-button>

      <vs-button v-if="resting"
                 vs-color="success"
                 vs-type="filled"
                 vs-icon="skip_next"
                 vs-size="large"
                 accesskey="k"
                 v-on:click="onSkip">Skip rest break</vs-button>
    </vs-col>
  </vs-row>
</template>

<script>
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
    stopped: {
      type: Boolean,
      required: false,
      default: true,
    },
    running: {
      type: Boolean,
      required: false,
      default: false,
    },
    resting: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.vs-button {
  margin: 2px;
}
</style>
