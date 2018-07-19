<template>
  <vs-row>
    <vs-col vs-type="flex" vs-justify="center" vs-align="flex-start" vs-w="12">
      <vs-input v-model="interruption"
                vs-icon="error_outline"
                placeholder="Interruption reason"
                v-on:keyup.enter="done"
                vs-description-text="Enter the reason for the interruption" />
      <vs-button vs-color="danger"
                 vs-type="filled"
                 v-on:click="done"
                 vs-icon="save"
                 vs-size="small"
                 accesskey="d">Done</vs-button>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: 'Interruption',
  props: {
    onSave: Function,
  },
  data: () => ({
    interruption: '',
  }),
  methods: {
    done() {
      if (this.interruption.trim().length === 0) {
        return;
      }

      this.onSave(this.interruption);

      this.interruption = '';
    },
  },
};
</script>

<style scoped>
.vs-button {
  margin-left: 5px;
}
</style>
