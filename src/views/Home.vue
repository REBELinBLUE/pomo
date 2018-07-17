<template>
  <div>
    <vs-row>
      <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
        <Timer />
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
        <TaskList />
      </vs-col>
    </vs-row>
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
