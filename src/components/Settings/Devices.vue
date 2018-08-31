<template>
  <sweet-modal ref="devices" :blocking="false" :enable-mobile-fullscreen="false" title="Pair a light" >
    <span v-if="!hasDevices">
      <div id="loading">indicator here</div> Scanning for bluetooth devices...
    </span>

    <vs-select v-if="hasDevices" v-model="selectedDevice">
      <vs-select-item :value="null" vs-text="Select a device" />
      <vs-select-item v-for="(item, index) in devices" :key="index" :vs-value="index" :vs-text="index" />
    </vs-select>

    <vs-row v-if="hasDevices" slot="button" >
      <vs-col vs-type="flex" vs-justify="flex-end" vs-align="center" vs-w="12">
        <vs-button :disabled="!hasSelectedDevice"
                   vs-color="danger"
                   vs-type="filled"
                   vs-icon="save"
                   vs-size="large"
                   accesskey="p"
                   @click="pair">Pair device</vs-button>
      </vs-col>
    </vs-row>
  </sweet-modal>
</template>

<script>
import { ipcRenderer } from 'electron'; // eslint-disable-line
import { SweetModal } from 'sweet-modal-vue';
import { mapState, mapMutations } from 'vuex';
import { DEVICE_PAIRED } from '@/store/constants';

export default {
  name: 'Devices',
  components: {
    SweetModal,
  },
  data: () => ({
    selectedDevice: null,
  }),
  computed: {
    ...mapState({
      devices: state => state.light.devices,
    }),
    hasSelectedDevice() {
      return !!this.selectedDevice;
    },
    hasDevices() {
      return Object.keys(this.devices).length > 0;
    },
  },
  methods: {
    ...mapMutations({
      paired: DEVICE_PAIRED,
    }),
    show() {
      this.$refs.devices.open();

      // this.$vs.loading({
      //   container: `#loading`,
      //   type:'material',
      //   scale: 0.45,
      // })
    },
    pair() {
      if (this.selectedDevice) {
        this.paired(this.selectedDevice);
      }

      this.$vs.loading.close();
      this.$refs.devices.close();

      ipcRenderer.send('device-paired', this.selectedDevice); // FIXME: Move this elsewhere, maybe an event?
    },
  },
};
</script>
