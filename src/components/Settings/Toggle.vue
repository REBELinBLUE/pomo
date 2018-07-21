<template>
  <div>
    <label>{{ label }}</label>
    <vs-switch v-model="model" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { SETTINGS_UPDATE } from '@/store/constants';

export default {
  name: 'Toggle',
  props: {
    label: String,
    setting: String,
  },
  methods: {
    ...mapMutations({
      update: SETTINGS_UPDATE,
    }),
  },
  computed: {
    // FIXME: There has to be a better way to do this....
    model: {
      get() {
        return this.$store.state.settings[this.setting];
      },
      set(value) {
        this.update({
          [this.setting]: value,
        });
      },
    },
  },
};
</script>
