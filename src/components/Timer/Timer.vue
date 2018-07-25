<template>
  <vs-alert vs-active="true" :vs-color="color">
    <Interruption v-if="interrupted" v-model="interruptionReason" :on-save="done" />

    <TaskName v-model="currentTask" />

    <Progress :completed="msRemaining"
              :total="msTotal"
              :completed-color="progressCompletedColor"
              :remaining-color="progressRemainingColor">

      <h2>{{ label }}</h2>

      <Countdown :label="label" :seconds="secondsRemaining" />

      <Actions :on-start="start"
               :on-interrupt="interrupt"
               :on-skip="skip"
               :stopped="stopped"
               :running="working"
               :resting="resting" />
    </Progress>

    <Summary :completed="completedCount" :target="targetCount" :failed="failedCount" />
  </vs-alert>
</template>

<script>
import { mapMutations } from 'vuex';
import { ADD_TASK } from '@/store/constants';
import Countdown from '@/components/Timer/Countdown.vue';
import Actions from '@/components/Timer/Actions.vue';
import Interruption from '@/components/Timer/Interruption.vue';
import Progress from '@/components/Timer/Progress.vue';
import Summary from '@/components/Timer/Summary.vue';
import TaskName from '@/components/Timer/TaskName.vue';

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;

// FIXME: Move counter details to state so it continues to work when switching screen
// FIXME: Timer isn't quite in sync
export default {
  name: 'Timer',
  components: {
    TaskName,
    Progress,
    Countdown,
    Actions,
    Interruption,
    Summary,
  },
  props: {
    autoStart: {
      type: Boolean,
      default: false,
    },
    intervalAlarm: {
      type: Boolean,
      default: true,
    },
    breakAlarm: {
      type: Boolean,
      default: true,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    completedCount: {
      type: Number,
      default: 0,
    },
    targetCount: {
      type: Number,
      default: 10,
    },
    intervalLength: {
      type: Number,
      default: 25,
    },
    restLength: {
      type: Number,
      default: 5,
    },
    longRestLength: {
      type: Number,
      default: 15,
    },
    longRestFrequency: {
      type: Number,
      default: 4,
    },
    now: {
      type: Function,
      default: () => new Date().getTime(),
    },
  },
  data: () => ({
    interrupted: false,
    currentTask: '',
    interruptionReason: '',
    isWork: true,
    isCounting: false,
    counter: 0,
    endTime: 0,
    completed: 0,
  }),
  computed: {
    label() {
      if (this.isWork) {
        return 'Work Interval';
      }

      if (this.isLongBreak) {
        return 'Long Break';
      }

      return 'Short Break';
    },
    msRemaining() {
      if (this.isCounting) {
        return this.msTotal - this.counter;
      }

      return this.msTotal;
    },
    msTotal() {
      let countdown = this.intervalLength;
      if (!this.isWork) {
        countdown = this.isLongBreak ? this.longRestLength : this.restLength;
      }

      return countdown * MILLISECONDS_MINUTE;
    },
    color() {
      return this.isWork ? 'danger' : 'success';
    },
    progressRemainingColor() {
      if (this.isWork) {
        return 'rgb(255, 71, 87)';
      }

      return 'rgb(109, 198, 81)';
    },
    progressCompletedColor() {
      if (this.isWork) {
        return 'rgb(251, 223, 223)';
      }

      return 'rgb(227, 244, 221)';
    },
    resting() {
      return !this.isWork;
    },
    working() {
      return this.isCounting && this.isWork;
    },
    stopped() {
      return !this.isCounting;
    },
    secondsRemaining() {
      return Math.round(this.msRemaining / MILLISECONDS_SECOND);
    },
    secondsCompleted() {
      return Math.floor((this.msTotal - this.msRemaining) / MILLISECONDS_SECOND);
    },
    taskName() {
      return this.currentTask.length > 0 ? this.currentTask : 'Unnamed';
    },
    shouldPlayAlarm() {
      if (this.isWork && this.intervalAlarm) {
        return true;
      } else if (!this.isWork && this.breakAlarm) {
        return true;
      }

      return false;
    },
    isLongBreak() {
      if (this.isWork) {
        return false;
      }

      return this.completed % this.longRestFrequency === 0;
    },
  },
  methods: {
    ...mapMutations({
      addTask: ADD_TASK,
    }),
    init() {
      this.isCounting = false;
      this.timeout = null;
      this.counter = 0;
      this.endTime = this.now() + this.msTotal;
    },
    start() {
      if (this.isCounting) {
        return;
      }

      this.init();

      this.$emit('timerstart', {
        isWork: this.isWork,
        msTotal: this.msTotal,
      });

      this.isCounting = true;
      this.next();
    },
    done() {
      this.addTask({
        interrupted: true,
        description: this.taskName,
        time: this.secondsCompleted,
        notes: this.interruptionReason,
      });

      this.interrupted = false;
      this.interruptionReason = null;

      this.reset();
    },
    interrupt() {
      if (!this.isWork) {
        return;
      }

      this.$emit('timerinterrupt', {
        isWork: false,
        msTotal: this.msTotal,
        msRemaining: this.msRemaining,
      });

      clearTimeout(this.timeout);
      this.timeout = null;

      this.interrupted = true;
      this.isWork = true;
    },
    skip() {
      if (this.isWork) {
        return;
      }

      this.$emit('timerskip');

      this.isWork = true;
      this.reset();
    },
    stop() {
      if (!this.isCounting) {
        return;
      }

      this.$emit('timerstop', {
        isWork: this.isWork,
        msTotal: this.msTotal,
      });

      if (this.isWork) {
        this.addTask({
          interrupted: false,
          description: this.taskName,
          time: this.secondsCompleted,
          notes: null,
        });

        this.completed = this.completed + 1;
      }

      this.playSound();

      this.isWork = !this.isWork;
      this.reset();

      if (this.autoStart) {
        setTimeout(this.start.bind(this), MILLISECONDS_SECOND);
      }
    },
    playSound() {
      if (this.shouldPlayAlarm) {
        const audio = new Audio('alarm.wav');
        audio.volume = 1.0;
        audio.play().catch(() => { /* Do not worry about this error */ });
      }
    },
    next() {
      this.timeout = setTimeout(this.step.bind(this), 10);
    },
    step() {
      if (!this.isCounting) {
        return;
      }

      if (this.msRemaining > 0) {
        const currentTime = this.now();
        const remaining = this.endTime - currentTime;
        const counter = this.msTotal - remaining;

        if (counter - this.counter >= 500) {
          this.counter = counter;

          this.$emit('timerprogress', {
            isWork: this.isWork,
            msTotal: this.msTotal,
            msRemaining: this.msRemaining,
          });
        }

        this.next();
      } else {
        this.stop();
      }
    },
    reset() {
      clearTimeout(this.timeout);

      this.$emit('timerreset', {
        isWork: this.isWork,
        msTotal: this.msTotal,
      });

      this.init();
    },
  },
  created() {
    this.completed = this.completedCount;
    this.init();

    this.$emit('timercreated', {
      isWork: this.isWork,
      msTotal: this.msTotal,
    });
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
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
