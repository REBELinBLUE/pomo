<template>
  <i class="material-icons" :style="{'color':`rgba(var(--${color}),1)`}">{{ icon }}</i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'transparent',
    },
  },
};
</script>
