<template>
  <vs-col vs-type="flex" vs-justify="center" vs-align="center" :vs-w="size">
    <slot></slot>
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
  },
};
</script>
