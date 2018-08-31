<template>
  <SettingsPanel :settings="settings" />
</template>

<script>
import { mapState } from 'vuex';
import SettingsPanel from '@/components/Settings/Settings.vue';

export default {
  name: 'Settings',
  components: {
    SettingsPanel,
  },
  computed: mapState({
    settings: state => state.settings,
  }),
};
</script>
