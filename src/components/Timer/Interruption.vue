<template>
  <sweet-modal ref="interrupt" title="Oh no!" hide-close-button blocking>
    <textarea v-model="innerValue" data-gramm_editor="false" placeholder="Why were you interrupted?" />

    <vs-alert :vs-active="showError" vs-color="danger" vs-icon="new_releases">
      Please enter a reason for the interruption
    </vs-alert>

    <vs-row slot="button">
      <vs-col vs-type="flex" vs-justify="flex-end" vs-align="center" vs-w="12">
        <vs-button vs-color="danger"
                   vs-type="filled"
                   vs-icon="save"
                   vs-size="large"
                   accesskey="d"
                   @click="done">Done</vs-button>
      </vs-col>
    </vs-row>
  </sweet-modal>
</template>

<script>
import { SweetModal } from 'sweet-modal-vue';

export default {
  name: 'Interruption',
  components: {
    SweetModal,
  },
  props: {
    onSave: {
      type: Function,
      required: true,
    },
    value: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      showError: false,
      innerValue: this.value,
    };
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
    innerValue(val) {
      this.showError = false;
      this.$emit('input', val);
    },
  },
  mounted() {
    this.$refs.interrupt.open();
  },
  methods: {
    done() {
      if (this.innerValue === null || this.innerValue.trim().length === 0) {
        this.showError = true;
        return;
      }

      this.$refs.interrupt.close();

      this.onSave();
    },
  },
};
</script>

<style scoped>
.vs-button {
  margin-right: 12px;
}

textarea {
  width: 100%;
  height: 175px;
  padding: 10px;
}
</style>
