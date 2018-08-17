<template>
  <vs-alert vs-margin="0" vs-active="true" vs-color="dark">
    <Dropdown v-model="interval" :options="workOptions" label="Work Interval" />
    <Dropdown v-model="rest" :options="restOptions" label="Short Break" />
    <Dropdown v-model="long_rest" :options="longRestOptions" label="Long Break" />
    <Dropdown v-model="long_rest_after" :options="intervalOptions" label="Long Break After" />
    <Dropdown v-model="target" :options="targetOptions" label="Target" />

    <vs-divider />

    <Toggle v-model="autostart" label="Auto-Start Timer" />
    <Toggle v-model="interval_alarm" label="Play Alarm Sound After Work Interval" />
    <Toggle v-model="break_alarm" label="Play Alarm Sound After Break" />

    <vs-divider />

    <Accelerator />
  </vs-alert>
</template>

<script>
import { mapMutations } from 'vuex';
import { SETTINGS_UPDATE } from '@/store/constants';
import Dropdown from '@/components/Settings/Dropdown.vue';
import Toggle from '@/components/Settings/Toggle.vue';
import Accelerator from '@/components/Settings/Accelerator.vue';

export default {
  name: 'SettingsPanel',
  components: {
    Dropdown,
    Toggle,
    Accelerator,
  },
  props: {
    settings: {
      type: Object, // FIXME: Can we make a settings object type?
      required: true,
    },
  },
  data() {
    return this.settings;
  },
  computed: {
    workOptions() {
      return this.generateOptions({
        min: 5,
        max: 60,
        increment: 5,
        label: 'minutes',
      });
    },
    restOptions() {
      return this.generateOptions({
        min: 1,
        max: 15,
        increment: 1,
        label: 'minutes',
      });
    },
    longRestOptions() {
      return this.generateOptions({
        min: 5,
        max: 30,
        increment: 5,
        label: 'minutes',
      });
    },
    intervalOptions() {
      return this.generateOptions({
        min: 2,
        max: 10,
        increment: 1,
        label: 'intervals',
      });
    },
    targetOptions() {
      const label = 'intervals per day';

      return [{
        text: '1 interval per day',
        value: 1,
      }].concat(this.generateOptions({
        min: 2,
        max: 24,
        increment: 1,
        label,
      })).concat(this.generateOptions({
        min: 25,
        max: 50,
        increment: 5,
        label,
      }));
    },
  },
  beforeDestroy() {
    this.update({
      interval: this.interval,
      rest: this.rest,
      long_rest: this.long_rest,
      long_rest_after: this.long_rest_after,
      target: this.target,
      autostart: this.autostart,
      interval_alarm: this.interval_alarm,
      break_alarm: this.break_alarm,
    });
  },
  methods: {
    ...mapMutations({
      update: SETTINGS_UPDATE,
    }),
    generateOptions: ({
      min, max, increment, label,
    }) => {
      const options = [];
      for (let value = min; value <= max; value += increment) {
        options.push({
          text: `${value} ${label}`,
          value,
        });
      }

      return options;
    },
  },
};
</script>

<style lang="scss">
h3 {
  font-size: 100%;
  font-weight: bolder;

  margin: {
    bottom: 10px;
  }
}

.vs-select-options, .con-select, .con-select .input-select {
  width: 150px !important;
}

.vs-select-options ul li {
  display: block !important;
}
</style>
