<template>
  <vs-col vs-type="flex" vs-justify="center" vs-align="center" :vs-w="size">
    <slot />
  </vs-col>
</template>

<script>
export default {
  name: 'TableCell',
  props: {
    size: {
      type: String,
      default: '1',
    },
    cssClass: {
      type: String,
      default: undefined,
    },
  },
};
</script>

<style scoped>
.vs-col {
  padding: 5px 5px 15px 5px;
}
</style>
