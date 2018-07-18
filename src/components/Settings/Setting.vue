<template>
  <div>
    <label>{{ label }}</label>
    <vs-select v-model="model">
      <vs-select-item :key="index"
                      :vs-value="item.value"
                      :vs-text="item.text" v-for="(item, index) in options" />
    </vs-select>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { SETTINGS_UPDATE } from '@/store/constants';

export default {
  name: 'Setting',
  props: {
    label: String,
    setting: String,
    options: Array,
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
          [this.setting]: parseInt(value, 10),
        });
      },
    },
  },
};
</script>
