<template>
  <vs-row>
    <TableCell size="1">{{ date }}</TableCell>
    <TableCell size="3">{{ item.description }}</TableCell>
    <TableCell size="1">{{ minutes }}:{{ seconds }}</TableCell>
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
      const date = new Date(this.item.date);

      const preprocess = value => (value < 10 ? `0${value}` : value);

      return `${preprocess(date.getDate())}/${preprocess(date.getMonth() + 1)}/${date.getFullYear()}`;
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
      const preprocess = value => (value < 10 ? `0${value}` : value);
      return preprocess(Math.floor(this.item.time / 60));
    },
    seconds() {
      const preprocess = value => (value < 10 ? `0${value}` : value);
      return preprocess(this.item.time - (Math.floor(this.item.time / 60) * 60));
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
