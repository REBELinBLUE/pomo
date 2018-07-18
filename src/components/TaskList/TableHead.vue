<template>
  <vs-col vs-type="flex" vs-justify="center" vs-align="center" :vs-w="size">
    <strong>
      <slot/>
    </strong>
  </vs-col>
</template>

<script>
export default {
  name: 'TableHead',
  props: {
    size: {
      type: String,
      default: '1',
    },
  },
};
</script>
