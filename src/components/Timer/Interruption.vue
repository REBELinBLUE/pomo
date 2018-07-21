<template>
  <sweet-modal title="Oh no!" ref="modal" hide-close-button blocking>
    <textarea data-gramm_editor="false"
              placeholder="Why were you interrupted?"
              v-model="innerValue" />

    <vs-row slot="button">
      <vs-col vs-type="flex" vs-justify="flex-end" vs-align="center" vs-w="12">
        <vs-button vs-color="danger"
                   vs-type="filled"
                   v-on:click="done"
                   vs-icon="save"
                   vs-size="large"
                   accesskey="d">Done</vs-button>
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
    onSave: Function,
    value: String,
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  watch: {
    value(val) {
      this.innerValue = val;
    },
    innerValue(val) {
      this.$emit('input', val);
    },
  },
  methods: {
    done() {
      if (this.innerValue.trim().length === 0) {
        this.$refs.modal.bounce();
        return;
      }

      this.$refs.modal.close();

      this.onSave();
    },
  },
  mounted() {
    this.$refs.modal.open();
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
