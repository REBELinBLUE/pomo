<template>
  <span>This is the actual timer! {{ length }} - {{ counter }} = {{ remaining }}</span>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import { TIMER_TICK, TIMER_STOP, TIMER_START, TIMER_RESET, ADD_TASK } from '@/store/constants';

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;

export default {
  name: 'Timer',
  props: {
    now: {
      type: Function,
      default: () => new Date().getTime(),
    },
  },
  data: () => ({
    endTime: 0,
  }),
  computed: {
    ...mapState({
      isCounting: state => state.timer.is_counting,
      isWorking: state => state.timer.is_working,
      isLongBreak: state => state.timer.is_long_break,
      completedCount: state => state.tasks.completed,
      counter: state => state.timer.counter,
      remaining: state => state.timer.remaining,
      length: state => state.timer.length,
      intervalLength: state => state.settings.interval,
      restLength: state => state.settings.rest,
      longRestLength: state => state.settings.long_rest,
      longRestFrequency: state => state.settings.long_rest_after,
      autoStart: state => state.settings.autostart,
      intervalAlarm: state => state.settings.interval_alarm,
      breakAlarm: state => state.settings.break_alarm,
    }),
    shouldPlayAlarm() {
      if (this.isWorking && this.intervalAlarm) {
        return true;
      } else if (!this.isWorking && this.breakAlarm) {
        return true;
      }

      return false;
    },
    msTotal() {
      let countdown = this.intervalLength;
      if (!this.isWorking) {
        countdown = this.isLongBreak ? this.longRestLength : this.restLength;
      }

      return countdown * MILLISECONDS_MINUTE;
    },
  },
  watch: {
    isCounting(newValue) {
      if (newValue) {
        this.start();
      }
    },
    isWorking(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.reset();
      }
    },
    completedCount(newValue, oldValue) {
      // FIXME: This is a horrible hack, should instead have a cycle count
      if (oldValue === -1) {
        return;
      }

      this.stopTimer({
        is_working: !this.isWorking,
      });

      this.autostartTimer();
    },
  },
  created() {
    this.reset();
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations({
      resetTimer: TIMER_RESET,
      timerTick: TIMER_TICK,
      startTimer: TIMER_START,
      stopTimer: TIMER_STOP,
    }),
    ...mapActions({
      addTask: ADD_TASK,
    }),
    autostartTimer() {
      if (this.autoStart) {
        setTimeout(this.startTimer, MILLISECONDS_SECOND);
      }
    },
    start() {
      this.endTime = this.now() + this.msTotal;

      // FIXME: fix variable casing
      this.$emit('timerstart', {
        isWork: this.isWorking,
        msTotal: this.msTotal,
      });

      this.tick();
    },
    tick() {
      this.timeout = setTimeout(this.step.bind(this), 10);
    },
    step() {
      if (!this.isCounting) {
        return;
      }

      if (this.remaining > 0) {
        const currentTime = this.now();
        const remaining = this.endTime - currentTime;
        const counter = this.length - remaining;

        if (counter - this.counter >= 250) {
          this.$emit('timerprogress', {
            isWork: this.isWorking,
            msTotal: this.length,
            msRemaining: remaining,
          });

          this.timerTick({
            // remaining,
            counter,
          });
        }

        this.tick();
      } else {
        this.playSound();

        this.$emit('timerstop', {
          isWork: this.isWorking,
          msTotal: this.length,
        });

        if (this.isWorking) {
          this.addTask({
            interrupted: false,
            notes: null,
          });
        } else {
          this.stopTimer({
            is_working: true,
          });

          this.autostartTimer();
        }
      }
    },
    reset() {
      this.resetTimer({
        length: this.msTotal,
      });

      this.$emit('timerreset', {
        isWork: this.isWorking,
        msTotal: this.msTotal,
      });

      clearTimeout(this.timeout);

      this.timeout = null;
    },
    playSound() {
      if (this.shouldPlayAlarm) {
        const audio = new Audio('alarm.mp3');
        audio.volume = 1.0;

        audio.play().then(() => {
          setTimeout(() => {
            audio.pause();
          }, 2000);
        }).catch(() => { /* Do not worry about this error */ });
      }
    },
  },
};
</script>

<style scoped lang="scss">
span {
  display: none;
  text-align: center;
  margin-bottom: 10px;
}
</style>
