<template>
  <div>
    <label>Status Light <Icon v-if="isPaired" :color="color" icon="lens" /></label>
    <vs-button :vs-icon="icon"
               vs-type="flat"
               vs-color="dark"
               vs-size="medium"
               @click="clicked">{{ deviceLabel }}</vs-button>

    <Devices ref="devices" />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'; // eslint-disable-line
import { mapState, mapMutations } from 'vuex';
import { DEVICE_UNPAIRED } from '@/store/constants';
import Icon from '@/components/Icon.vue';
import Devices from '@/components/Settings/Devices.vue';

export default {
  name: 'Light',
  components: {
    Icon,
    Devices,
  },
  data: () => ({
    pairing: false,
  }),
  computed: {
    ...mapState({
      connected: state => state.light.connected,
      device: state => state.settings.device,
    }),
    icon() {
      return this.isPaired ? 'bluetooth_disconnect' : 'bluetooth_searching';
    },
    isPaired() {
      return !!this.device;
    },
    deviceLabel() {
      return this.isPaired ? this.device : 'Not Paired';
    },
    color() {
      if (this.connected) {
        return 'success';
      }

      return 'danger';
    },
  },
  methods: {
    ...mapMutations({
      unpaired: DEVICE_UNPAIRED,
    }),
    clicked() {
      if (this.isPaired) {
        return this.unpair();
      }

      return this.pair();
    },
    pair() {
      this.$refs.devices.show(); // FIXME: This does not seem the best way
    },
    unpair() {
      this.unpaired();

      ipcRenderer.send('device-unpaired'); // FIXME: Move this elsewhere, maybe an event?
    },
  },
};
</script>

<style scoped lang="scss">
div {
  clear: right;

  margin: {
    right: 2px;
    bottom: 10px;
  }

  .vs-button {
    float: right;
  }
}

.material-icons {
  font-size: 70%;
}

.sweet-modal-overlay {
  margin-top: 50px;
}
</style>
