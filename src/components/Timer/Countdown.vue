<template>
  <h1>{{ seconds | minutesRemaining | zeroPad }}:{{ seconds | secondsRemaining | zeroPad }}</h1>
</template>

<script>
export default {
  name: 'Countdown',
  props: {
    seconds: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped lang="scss">
h1 {
  text-align: center;
  font-size: 700%;
  position: relative;
  top: 10px;
}
</style>
