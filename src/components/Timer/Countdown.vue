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
      const minutes = Math.floor((this.seconds % SECONDS_HOUR) / SECONDS_MINUTE);
      return Math.floor(minutes);
    },
    secondsRemaining() {
      const seconds = (this.seconds % SECONDS_MINUTE);
      return Math.floor(seconds);
    },
  },
};
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  font-size: 750%
}
</style>
