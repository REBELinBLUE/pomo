<template>
  <vs-row>
    <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
      <vs-card>
        <vs-card-header vs-background-color="primary"
                        vs-title="Settings"
                        vs-icon="settings"
                        :vs-fill="true" />
        <vs-card-body>
          <Option label="Work Interval" setting="interval" :options="workOptions" />
          <Option label="Short Break" setting="rest" :options="restOptions" />
          <Option label="Long Break" setting="long_rest" :options="longRestOptions" />
          <Option label="Long Break After" setting="long_rest_after" :options="intervalOptions" />
          <Option label="Target" setting="target" :options="targetOptions" />

          <vs-divider />

          <Toggle label="Auto-start Timer" setting="autostart" />
          <Toggle label="Play alarm sound at end of work interval" setting="interval_alarm" />
          <Toggle label="Play alarm sound at end of break" setting="break_alarm" />

          <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <router-link to="/">
                <vs-button vs-color="success"
                           vs-type="filled"
                           vs-icon="save"
                           vs-size="large"
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
import Option from '@/components/Settings/Option.vue';
import Toggle from '@/components/Settings/Toggle.vue';

// FIXME: Change so state is only updated on save
export default {
  name: 'SettingsPanel',
  components: {
    Option,
    Toggle,
  },
  methods: {
    ...mapMutations({
      update: SETTINGS_UPDATE,
    }),
    generateOptions: ({
      minimum, maximum, increment, label,
    }) => {
      const options = [];
      for (let value = minimum; value <= maximum; value += increment) {
        options.push({
          text: `${value} ${label}`,
          value,
        });
      }

      return options;
    },
  },
  computed: {
    workOptions() {
      return this.generateOptions({
        minimum: 5,
        maximum: 60,
        increment: 5,
        label: 'minutes',
      });
    },
    restOptions() {
      return this.generateOptions({
        minimum: 1,
        maximum: 15,
        increment: 1,
        label: 'minutes',
      });
    },
    longRestOptions() {
      return this.generateOptions({
        minimum: 5,
        maximum: 30,
        increment: 5,
        label: 'minutes',
      });
    },
    intervalOptions() {
      return this.generateOptions({
        minimum: 2,
        maximum: 10,
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
        minimum: 2,
        maximum: 24,
        increment: 1,
        label,
      })).concat(this.generateOptions({
        minimum: 25,
        maximum: 50,
        increment: 5,
        label,
      }));
    },
    autostart: {
      get() {
        return this.$store.state.settings.autostart;
      },
      set(value) {
        this.update({
          autostart: !!value,
        });
      },
    },
  },
};
</script>
