<template>
  <sweet-modal title="Oh no!" ref="modal" hide-close-button blocking>
    <textarea data-gramm_editor="false"
              placeholder="why were you interrupted"
              v-model="interruption"
              style="width:100%; padding: 10px"
              rows="10" />
    <vs-button slot="button" vs-color="success"
               vs-type="filled"
               v-on:click="done"
               vs-icon="save"
               vs-size="large"
               accesskey="d">Done</vs-button>
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
  },
  data: () => ({
    interruption: '',
  }),
  methods: {
    done() {
      if (this.interruption.trim().length === 0) {
        this.$refs.modal.bounce();
        return;
      }

      this.$refs.modal.close();

      this.onSave(this.interruption);

      this.interruption = '';
    },
  },
  mounted() {
    this.$refs.modal.open();
  },
};
</script>

<style scoped>
.vs-button {
  margin-left: 5px;
}
</style>
