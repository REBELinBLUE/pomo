<template>
  <vs-row>
    <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">

      <vs-card>
        <vs-card-header vs-background-color="primary"
                        vs-title="Settings"
                        vs-icon="settings"
                        :vs-fill="true" />
        <vs-card-body>
          <!-- fixme: change to drop downs -->

          <label>Work Interval</label>
          <vs-select v-model="interval">
            <vs-select-item :key="index"
                            :vs-value="item.value"
                            :vs-text="item.text" v-for="(item, index) in workOptions" />
          </vs-select>

          <label>Short Break</label>
          <vs-select v-model="rest">
            <vs-select-item :key="index"
                            :vs-value="item.value"
                            :vs-text="item.text" v-for="(item, index) in restOptions" />
          </vs-select>

          <label>Long Break</label>
          <vs-select v-model="long_rest">
            <vs-select-item :key="index"
                            :vs-value="item.value"
                            :vs-text="item.text" v-for="(item, index) in longRestOptions" />
          </vs-select>

          <label>Long Break After</label>
          <vs-select v-model="break_after">
            <vs-select-item :key="index"
                            :vs-value="item.value"
                            :vs-text="item.text" v-for="(item, index) in intervalOptions" />
          </vs-select>

          <label>Target</label>
          <vs-select v-model="target">
            <vs-select-item :key="index"
                            :vs-value="item.value"
                            :vs-text="item.text" v-for="(item, index) in targetOptions" />
          </vs-select>

          <vs-divider />

          <label>Auto-start Timer</label>
          <vs-switch v-model="autostart" />

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

import { SETTINGS_UPDATE } from '../store/mutations';

// FIXME: Change so state is only updated on save
export default {
  name: 'settings',
  methods: {
    ...mapMutations({
      update: SETTINGS_UPDATE,
    }),
  },
  computed: {
    workOptions() {
      const options = [];
      for (let i = 5; i <= 60; i = i + 5) {
        options.push({
          text: `${i} minutes`,
          value: i,
        });
      }

      return options;
    },
    restOptions() {
      const options = [];
      for (let i = 0; i <= 15; i++) {
        options.push({
          text: `${i} minutes`,
          value: i,
        });
      }

      return options;
    },
    longRestOptions() {
      const options = [];
      for (let i = 0; i <= 30; i = i + 5) {
        options.push({
          text: `${i} minutes`,
          value: i,
        });
      }

      return options;
    },
    intervalOptions() {
      const options = [];
      for (let i = 2; i <= 10; i++) {
        options.push({
          text: `${i} intervals`,
          value: i,
        });
      }

      return options;
    },
    targetOptions() {
      const options = [];
      for (let i = 1; i <= 24; i++) {
        options.push({
          text: `${i} interval${i > 1 ? 's' : ''} per day`,
          value: i,
        });
      }

      for (let i = 25; i <= 50; i = i + 5) {
        options.push({
          text: `${i} intervals per day`,
          value: i,
        });
      }

      return options;
    },
    interval: {
      get() {
        return this.$store.state.settings.interval;
      },
      set(value) {
        this.update({
          interval: parseInt(value, 10),
        });
      },
    },
    rest: {
      get() {
        return this.$store.state.settings.rest;
      },
      set(value) {
        this.update({
          rest: parseInt(value, 10),
        });
      },
    },
    long_rest: {
      get() {
        return this.$store.state.settings.long_rest;
      },
      set(value) {
        this.update({
          long_rest: parseInt(value, 10),
        });
      },
    },
    break_after: {
      get() {
        return this.$store.state.settings.break_after;
      },
      set(value) {
        this.update({
          break_after: parseInt(value, 10),
        });
      },
    },
    target: {
      get() {
        return this.$store.state.settings.target;
      },
      set(value) {
        this.update({
          target: parseInt(value, 10),
        });
      },
    },
    autostart: {
      get() {
        return this.$store.state.settings.autostart;
      },
      set(value) {
        this.update({
          autostart: value,
        });
      },
    },
  },
};
</script>
