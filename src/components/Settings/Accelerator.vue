<template>
  <input type="text" :value="value" v-on:keydown="keyDown" v-on:keyup="keyUp" readonly />
</template>

<script>
export default {
  name: 'Accelerator',
  data: () => ({
    value: 'foo',
    pressedKeys: [],
    keyCount: 0,
  }),
  methods: {
    keyDown(event) {
      event.preventDefault();

      if (this.keyCount <= 0) {
        this.pressedKeys = [];
      }

      if (this.pressedKeys.indexOf(event.key) === -1) {
        console.log(event);
        this.pressedKeys.push(event.key);
        this.keyCount++;
      }

      const states = {
        alt: event.altKey,
        ctrl: event.ctrlKey,
        meta: event.metaKey,
        shift: event.shiftKey,
      };
      const key = event.key;
      const code = event.code;
      console.log(`keydown key: ${key}, code: ${code}`, states);

      this.mapAccelerator(this.pressedKeys);
    },
    keyUp(event) {
      event.preventDefault();

      this.keyCount--;
      this.mapAccelerator(this.pressedKeys);
    },
    mapAccelerator(keys) {
      console.log(keys);
      this.value = keys.map((item) => {
        if (item === ' ') return 'Space';
        if (item === '+') return 'Plus';
        if (/^[a-z]$/.test(item)) return item.toUpperCase();
        return item;
      }).join('+');
    },
  },
};
</script>

<style scoped lang="scss">
input {
  width: 100%;
  font-size: 14px;
  padding: 4px;
  background-color: rgb(243, 243, 243);
}
</style>
