<template>
  <h1>{{ minutesRemaining | zeroPad }}:{{ secondsRemaining | zeroPad }}</h1>
</template>

<script>
const MILLISECONDS_SECOND = 1;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;

export default {
  name: 'Countdown',
  props: {
    seconds: { // FIXMNE; Is milliseconds
      type: Number,
      default: 0,
    },
  },
  computed: {
    minutesRemaining() {
      const minutes = Math.floor((this.seconds % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE);
      return Math.floor(minutes);
    },
    secondsRemaining() {
      const seconds = (this.seconds % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND;
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
