<template>
  <vs-alert :vs-color="color" vs-active="true" vs-margin="0">
    <!-- fixme: replace with events -->
    <Interruption v-if="interrupted" v-model="interruptionReason" :on-save="done" />

    <TaskName v-model="currentTask" />

    <Progress>
      <h2>{{ label }}</h2>

      <Countdown :label="label" :seconds="secondsRemaining" />

      <!-- fixme: replace with events -->
      <Actions :on-start="start" :on-interrupt="interrupt" :on-skip="skip" />
    </Progress>

    <Summary />
  </vs-alert>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { ADD_TASK, TIMER_START, TIMER_STOP, TIMER_PAUSE, TIMER_RESET } from '@/store/constants';
import Countdown from '@/components/Timer/Countdown.vue';
import Actions from '@/components/Timer/Actions.vue';
import Interruption from '@/components/Timer/Interruption.vue';
import Progress from '@/components/Timer/Progress.vue';
import Summary from '@/components/Timer/Summary.vue';
import TaskName from '@/components/Timer/TaskName.vue';

const MILLISECONDS_SECOND = 1000;

export default {
  name: 'Display',
  components: {
    TaskName,
    Progress,
    Countdown,
    Actions,
    Interruption,
    Summary,
  },
  data: () => ({
    interrupted: false,
    currentTask: '',
    interruptionReason: '',
  }),
  computed: {
    ...mapState({
      remaining: state => state.timer.remaining,
      length: state => state.timer.length,
      isWorking: state => state.timer.is_working,
      isCounting: state => state.timer.is_counting,
      isLongBreak: state => state.timer.is_long_break,
      completedCount: state => state.tasks.completed,
      failedCount: state => state.tasks.failed,
      targetCount: state => state.settings.target,
    }),
    secondsRemaining() {
      return Math.round(this.remaining / MILLISECONDS_SECOND);
    },
    label() {
      if (this.isWorking) {
        return 'Work Interval';
      }

      if (this.isLongBreak) {
        return 'Long Break';
      }

      return 'Short Break';
    },
    color() {
      return this.isWorking ? 'danger' : 'success';
    },
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations({
      resetTimer: TIMER_RESET,
      startTimer: TIMER_START,
      stopTimer: TIMER_STOP,
      pauseTimer: TIMER_PAUSE,
    }),
    ...mapActions({
      addTask: ADD_TASK,
    }),
    start() {
      if (this.isCounting) {
        return;
      }

      this.startTimer();
    },
    done() {
      this.addTask({
        interrupted: true,
        notes: this.interruptionReason,
      });

      this.interrupted = false;
      this.interruptionReason = null;

      this.resetTimer({
        length: this.length,
      });

      this.$emit('timerreset', {
        isWork: true,
        msTotal: this.length,
      });
    },
    interrupt() {
      if (!this.isWorking) {
        return;
      }

      this.$emit('timerinterrupt', {
        isWork: false,
        msTotal: this.length,
        msRemaining: this.remaining,
      });

      this.interrupted = true;

      this.pauseTimer();
    },
    skip() {
      this.stopTimer({
        is_working: true,
      });

      this.$emit('timerskip');
    },
  },
};
</script>

<style scoped lang="scss">
h2 {
  font-size: 150%;
  font-weight: bolder;
  text-align: center;
  position: relative;
  top: 10px;
}
</style>
