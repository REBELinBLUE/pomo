<template>
  <vs-row>
    <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
      <vs-alert vs-active="true" :vs-color="color">
        <vs-progress :vs-height="8" :vs-percent="percentageRemaining" :vs-color="color" />

        <vs-row id="stats">
          <vs-col vs-type="flex" vs-justify="flex-start" vs-align="center" vs-w="4">
            <h2>{{ label }}</h2>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
            <vs-input vs-icon="alarm"
                      placeholder="Enter task name..."
                      v-model="currentTask"
                      v-if="!resting" />
            &nbsp;
          </vs-col>
          <vs-col vs-type="flex" vs-justify="flex-end" vs-align="center" vs-w="4">
            <Summary :completed="completedCount" :target="targetCount" :failed="failedCount" />
          </vs-col>
        </vs-row>

        <Countdown :seconds="secondsRemaining" />

        <Interruption v-if="interrupted" :onSave="done" />
        <Actions :onStart="start"
                 :onInterrupt="interrupt"
                 :onSkip="skip"
                 :stopped="stopped"
                 :running="working"
                 :resting="resting" />
      </vs-alert>
    </vs-col>
  </vs-row>
</template>

<script>
import { mapMutations } from 'vuex';
import { ADD_TASK } from '@/store/constants';
import Countdown from '@/components/Timer/Countdown.vue';
import Summary from '@/components/Timer/Summary.vue';
import Actions from '@/components/Timer/Actions.vue';
import Interruption from '@/components/Timer/Interruption.vue';

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;

// FIXME: Move counter details to state so it continues to work when switching screen
export default {
  name: 'Timer',
  components: {
    Countdown,
    Summary,
    Actions,
    Interruption,
  },
  props: {
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
    isWork: true,
    isCounting: false,
    counter: 0,
    endTime: 0,
    timeout: null,
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
    percentageRemaining() {
      return Math.floor((this.msRemaining / this.msTotal) * 100);
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
    isLongBreak() {
      if (this.isWork) {
        return false;
      }

      return this.completedCount % this.longRestFrequency === 0;
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
    done(reason) {
      this.addTask({
        interrupted: true,
        description: this.taskName,
        time: this.secondsCompleted,
        notes: reason,
      });

      this.interrupted = false;

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

      cancelAnimationFrame(this.timeout);
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

      this.$emit('timerend', {
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
      }

      this.isWork = false;
      this.reset();
    },
    next() {
      this.timeout = requestAnimationFrame(this.step.bind(this));
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
      cancelAnimationFrame(this.timeout);

      this.init();
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.timeout);
  },
};
</script>

<style scoped lang="scss">
h2 {
  font-size: 150%;
  font-weight: bolder;
}
#stats {
  margin-top: 10px;
}
</style>
