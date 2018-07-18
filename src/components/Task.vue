<template>
  <vs-row>
    <TableCell size="1">{{ day | zeroPad }}/{{ month | zeroPad }}/{{ year }}</TableCell>
    <TableCell size="3">{{ item.description }}</TableCell>
    <TableCell size="1">{{ minutes | zeroPad }}:{{ seconds | zeroPad }}</TableCell>
    <TableCell size="2">
      <vs-chip :vs-icon="icon" :vs-color="color">{{ label }}</vs-chip>
    </TableCell>
    <TableCell size="5">{{ item.notes }}</TableCell>
  </vs-row>
</template>

<script>
import TableCell from '@/components/TableCell.vue';

export default {
  name: 'Task',
  props: {
    item: Object,
  },
  computed: {
    date() {
      return new Date(this.item.date);
    },
    day() {
      return this.date.getDate();
    },
    month() {
      return this.date.getMonth() + 1;
    },
    year() {
      return this.date.getFullYear();
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
      return Math.floor(this.item.time / 60);
    },
    seconds() {
      return this.item.time - (Math.floor(this.item.time / 60) * 60);
    },
  },
  methods: {
    isCompleted() {
      return this.item.status === 'success';
    },
  },
  components: {
    TableCell,
  },
};
</script>
