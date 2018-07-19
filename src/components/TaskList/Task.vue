<template>
  <vs-row>
    <TableCell size="1">{{ date }}</TableCell>
    <TableCell size="3">{{ item.description }}</TableCell>
    <TableCell size="1">{{ minutes | zeroPad }}:{{ seconds | zeroPad }}</TableCell>
    <TableCell size="2">
      <vs-chip :vs-icon="icon" :vs-color="color">{{ label }}</vs-chip>
    </TableCell>
    <TableCell size="5">{{ item.notes }}</TableCell>
    <vs-divider />
  </vs-row>
</template>

<script>
import dateFormat from 'dateformat';
import TableCell from '@/components/TaskList/TableCell.vue';

const SECONDS_MINUTE = 60;

export default {
  name: 'Task',
  components: {
    TableCell,
  },
  props: {
    item: Object,
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

<style scoped>
.con-vs-chip {
  margin: -2px 0 0 0 !important;
  position: absolute;
  font-weight: bolder;
}
</style>
