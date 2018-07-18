<template>
  <vs-row>
    <vs-col vs-offset="1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
      <vs-alert vs-active="true" :vs-color="color">
        <vs-progress :vs-height="8" :vs-percent="percentage" :vs-color="color" />

        <vs-row id="stats">
          <vs-col vs-type="flex" vs-justify="flex-start" vs-align="center" vs-w="4">
            <h2>{{ label }}</h2>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
            <vs-input vs-icon="alarm"
                      placeholder="Enter task name..."
                      v-model="task"
                      v-if="!resting" />
          </vs-col>
          <vs-col vs-type="flex" vs-justify="flex-end" vs-align="center" vs-w="4">
            <Summary :completed="completedCount" :target="targetCount" :failed="failedCount" />
          </vs-col>
        </vs-row>

        <Countdown :seconds="secondsRemaining" />

        <Actions :onStart="start"
                 :onInterrupt="interrupt"
                 :onSkip="skip"
                 :stopped="stopped"
                 :running="running"
                 :resting="resting" />
      </vs-alert>
    </vs-col>
  </vs-row>
</template>

<script>
import { mapMutations } from 'vuex';
import { WORK_ADD_TASK } from '@/store/constants';
import Countdown from '@/components/Timer/Countdown.vue';
import Summary from '@/components/Timer/Summary.vue';
import Actions from '@/components/Timer/Actions.vue';

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;

export default {
  name: 'Timer',
  components: {
    Countdown,
    Summary,
    Actions,
  },
  props: {
    failedCount: {
      type: Number,
      default: () => 0,
    },
    completedCount: {
      type: Number,
      default: () => 0,
    },
    targetCount: {
      type: Number,
      default: () => 10,
    },
    now: {
      type: Function,
      default: () => Date.now(),
    },
  },
  data: () => ({
    timer: 'work',
    count: 0,
    counting: false,
    endTime: 0,
    task: '',
  }),
  computed: {
    label() {
      if (this.isWork()) {
        return 'Work Interval';
      }

      if (this.isLongBreak()) {
        return 'Long Break';
      }

      return 'Short Break';
    },
    countdown() {
      if (!this.isWork()) {
        if (!this.isLongBreak()) {
          return this.$store.state.settings.rest; // FIXME: Don't use state directly
        }

        return this.$store.state.settings.long_rest;
      }

      return this.$store.state.settings.interval;
    },
    color() {
      if (this.isWork()) {
        return 'danger';
      }

      return 'success';
    },
    // Percentage of time remaining
    percentage() {
      const total = this.countdown * MILLISECONDS_MINUTE;
      const seconds = Math.floor(this.count / MILLISECONDS_SECOND);

      return Math.floor((seconds / (total / MILLISECONDS_SECOND)) * 100);
    },
    resting() {
      return !this.isWork();
    },
    running() {
      return this.counting && this.isWork();
    },
    stopped() {
      return !this.counting;
    },
    secondsRemaining() {
      const seconds = this.count / MILLISECONDS_SECOND;

      return Math.floor(seconds);
    },
    taskName() {
      return this.task.length > 0 ? this.task : 'Unnamed';
    },
    completedTime() {
      return (this.total - this.count) / MILLISECONDS_SECOND;
    },
  },
  methods: {
    ...mapMutations({
      addTask: WORK_ADD_TASK,
    }),
    init() {
      this.total = this.countdown * MILLISECONDS_MINUTE;
      this.count = this.total; // TODO: Figure out why it breaks if using this.now
      this.endTime = this.now() + this.total;
    },
    start() {
      if (this.counting) {
        return;
      }

      this.init();

      this.$emit('timerstart', {
        type: this.timer,
        countdown: this.countdown,
      });

      this.counting = true;
      this.next();
    },
    next() {
      this.timeout = setTimeout(this.step.bind(this), MILLISECONDS_SECOND);
    },
    step() {
      if (!this.counting) {
        return;
      }

      if (this.count > 0) {
        this.count -= MILLISECONDS_SECOND;

        if (this.count > 0) {
          this.$emit('timerprogress', {
            percentage: this.percentage,
            type: this.timer,
            countdown: this.countdown,
            secondsRemaining: this.secondsRemaining,
          });
        }

        this.next();
      } else {
        this.stop();
      }
    },
    interrupt() {
      if (this.isWork()) {
        this.addTask({
          interrupted: true,
          description: this.taskName,
          time: this.completedTime,
          notes: null,
        });
      }

      this.init();

      this.counting = false;
      clearTimeout(this.timeout);
      this.timeout = undefined;

      this.$emit('timerinterrupt', {
        percentage: this.percentage,
        countdown: this.countdown,
        secondsRemaining: this.secondsRemaining,
      });
    },
    skip() {
      this.counting = false;
      clearTimeout(this.timeout);
      this.timeout = undefined;

      this.timer = 'work';

      this.init();

      this.$emit('timerskip');
    },
    stop() {
      if (this.isWork()) {
        this.addTask({
          interrupted: false,
          description: this.taskName,
          time: this.completedTime,
          notes: null,
        });
      }

      this.$emit('timerend', {
        type: this.timer,
        countdown: this.countdown,
      });

      this.counting = false;
      this.timeout = undefined;

      if (this.isWork()) {
        this.timer = 'rest';
      } else {
        this.timer = 'work';
      }

      this.init();

      clearTimeout(this.timeout);
    },
    update() {
      if (this.counting) {
        this.count = Math.max(0, this.endTime - this.now());
      }
    },
    isWork() {
      return this.timer === 'work';
    },
    isLongBreak() {
      if (this.isWork()) {
        return false;
      }

      return this.completedCount % this.$store.state.settings.long_rest_after === 0;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    window.addEventListener('focus', (this.onFocus = this.update.bind(this)));
  },
  beforeDestroy() {
    window.removeEventListener('focus', this.onFocus);
    clearTimeout(this.timeout);
  },
};
</script>

<style scoped lang="scss">
h2 {
  font-size: 150%
}
#stats {
  margin-top: 10px;
  font-weight: bolder
}
.vs-button {
  margin: 2px;
}
</style>
