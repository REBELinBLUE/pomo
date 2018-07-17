<template>
  <div>
    <Timer />
    <TaskList />
  </div>
</template>

<script>
import Timer from '@/components/Timer.vue';
import TaskList from '@/components/TaskList.vue';

export default {
  name: 'home',
  components: {
    Timer,
    TaskList,
  },
};
</script>
