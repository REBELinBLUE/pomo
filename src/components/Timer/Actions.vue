<template>
  <vs-row>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
      <vs-button vs-color="success"
                 vs-type="filled"
                 v-on:click="onStart"
                 v-if="stopped"
                 vs-icon="play_arrow"
                 vs-size="large"
                 accesskey="s">Start countdown</vs-button>
      <vs-button vs-color="danger"
                 vs-type="filled"
                 v-on:click="onInterrupt"
                 v-if="running"
                 vs-icon="warning"
                 vs-size="large"
                 accesskey="i">Work interruption</vs-button>
      <vs-button vs-color="success"
                 vs-type="filled"
                 v-on:click="onSkip"
                 v-if="resting"
                 vs-icon="skip_next"
                 vs-size="large"
                 accesskey="k">Skip rest break</vs-button>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: 'Actions',
  props: {
    onStart: Function,
    onInterrupt: Function,
    onSkip: Function,
    stopped: {
      type: Boolean,
      default: true,
    },
    running: {
      type: Boolean,
      default: false,
    },
    resting: {
      type: Boolean,
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
