<template>
  <h1>{{ minutesRemaining | zeroPad }}:{{ secondsRemaining | zeroPad }}</h1>
</template>

<script>
const SECONDS_MINUTE = 60;
const SECONDS_HOUR = 60 * SECONDS_MINUTE;

export default {
  name: 'Countdown',
  props: {
    seconds: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    minutesRemaining() {
      let remaining = Math.floor(Math.floor((this.seconds % SECONDS_HOUR) / SECONDS_MINUTE));

      if (remaining < 0) {
        remaining = 0;
      }

      return remaining;
    },
    secondsRemaining() {
      let remaining = Math.floor((this.seconds % SECONDS_MINUTE));

      if (remaining < 0) {
        remaining = 0;
      }

      return remaining;
    },
  },
};
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  font-size: 750%;
}
</style>
