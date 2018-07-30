<template>
  <div>
    <vs-list-item :vs-title="item.description" :vs-subtitle="item.notes">
      <template slot="avatar">
        <Icon :icon="icon" :color="color" />
      </template>
      <span>{{ minutes | zeroPad }}:{{ seconds | zeroPad }}</span>
    </vs-list-item>
    <vs-divider />
  </div>
</template>

<script>
import dateFormat from 'dateformat';
import Icon from '@/components/Icon.vue';

const SECONDS_MINUTE = 60;

export default {
  name: 'Task',
  components: {
    Icon,
  },
  props: {
    item: {
      type: Object, // FIXME: Can we make a task object type?
      required: true,
    },
  },
  computed: {
    date() {
      return dateFormat(new Date(this.item.date), 'dd/mm/yyyy');
    },
    icon() {
      if (this.isCompleted()) {
        return 'check_circle';
      }

      return 'error';
    },
    color() {
      if (this.isCompleted()) {
        return 'success';
      }

      return 'danger';
    },
    label() {
      if (this.isCompleted()) {
        return 'Completed';
      }

      return 'Interrupted';
    },
    minutes() {
      return Math.floor(this.item.time / SECONDS_MINUTE);
    },
    seconds() {
      return Math.floor(this.item.time - (this.minutes * SECONDS_MINUTE));
    },
  },
  methods: {
    isCompleted() {
      return !this.item.interrupted;
    },
  },
};
</script>

<style scoped lang="scss">
.vs-list-item {
  min-height: 72px;

  /deep/ .list-title,
  /deep/ .list-subtitle {
    max-width: 285px;
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
  }
}

.vs-divider {
  margin: 0px;
}
span {
  padding-right: 20px;
}

</style>
