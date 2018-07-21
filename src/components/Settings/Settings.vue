<template>
  <vs-row>
    <vs-col vs-offset="4" vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
      <vs-card>
        <vs-card-header vs-background-color="primary"
                        vs-title="Settings"
                        vs-icon="settings"
                        :vs-fill="true" />
        <vs-card-body>
          <Dropdown label="Work Interval" v-model="interval" :options="workOptions" />
          <Dropdown label="Short Break" v-model="rest" :options="restOptions" />
          <Dropdown label="Long Break" v-model="long_rest" :options="longRestOptions" />
          <Dropdown label="Long Break After" v-model="long_rest_after" :options="intervalOptions" />
          <Dropdown label="Target" v-model="target" :options="targetOptions" />

          <vs-divider />

          <Toggle label="Auto-start Timer" v-model="autostart" />
          <Toggle label="Play alarm sound at end of work interval" v-model="interval_alarm" />
          <Toggle label="Play alarm sound at end of break" v-model="break_alarm" />

          <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <router-link to="/">
                <vs-button vs-color="success"
                           vs-type="filled"
                           vs-icon="save"
                           vs-size="large"
                           v-on:click="save"
                           accesskey="d">Done</vs-button>
              </router-link>
            </vs-col>
          </vs-row>
        </vs-card-body>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import { mapMutations } from 'vuex';
import { SETTINGS_UPDATE } from '@/store/constants';
import Dropdown from '@/components/Settings/Dropdown.vue';
import Toggle from '@/components/Settings/Toggle.vue';

export default {
  name: 'SettingsPanel',
  components: {
    Dropdown,
    Toggle,
  },
  props: {
    settings: Object,
  },
  data() {
    return this.settings;
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
    save() {
      this.update({
        interval: parseInt(this.interval, 10),
        rest: parseInt(this.rest, 10),
        long_rest: parseInt(this.long_rest, 10),
        long_rest_after: parseInt(this.long_rest_after, 10),
        target: parseInt(this.target, 10),
        autostart: !!this.autostart,
        interval_alarm: !!this.interval_alarm,
        break_alarm: !!this.break_alarm,
      });
    },
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
};
</script>

<style scoped lang="scss">
.vs-button {
  margin-top: 20px;
}
</style>
