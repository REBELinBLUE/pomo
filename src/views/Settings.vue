<template>
  <SettingsPanel :settings="settings" />
</template>

<script>
import SettingsPanel from '@/components/Settings/Settings.vue';

export default {
  name: 'Settings',
  components: {
    SettingsPanel,
  },
  data() {
    return {
      settings: this.$store.state.settings,
    };
  },
};
</script>
