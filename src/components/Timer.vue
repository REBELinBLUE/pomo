<template>
  <vs-alert vs-active="true" :vs-color="color">
    <vs-progress :vs-height="8" :vs-percent="percentage" :vs-color="color" />


    <vs-row id="stats">
      <vs-col vs-type="flex"
              vs-justify="flex-start"
              vs-align="center"
              vs-w="4">
        <h2>{{ label }}</h2>
      </vs-col>
      <vs-col vs-type="flex"
              vs-justify="center"
              vs-align="center"
              vs-w="4">
        <vs-input vs-icon="alarm" placeholder="Enter task name..." v-model="task" v-if="!resting" />
        &nbsp;
      </vs-col>
      <vs-col vs-type="flex"
              vs-justify="flex-end"
              vs-align="center"
              vs-w="4">
        <vs-chip vs-color="success"
                 vs-icon="check_circle">
          Completed: {{ completedCount }}/{{ target }}
        </vs-chip>
        <vs-chip vs-color="danger"
                 vs-icon="error">
          Interruptions: {{ failedCount }}
        </vs-chip>
      </vs-col>
    </vs-row>

    <h1>{{ minutes | zeroPad }}:{{ seconds | zeroPad }}</h1>

    <vs-row>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
        <vs-button vs-color="success"
                   vs-type="filled"
                   v-on:click="start"
                   v-if="stopped"
                   vs-icon="play_arrow"
                   vs-size="large"
                   accesskey="s">Start countdown</vs-button>
        <vs-button vs-color="danger"
                   vs-type="filled"
                   v-on:click="interrupt"
                   v-if="running"
                   vs-icon="warning"
                   vs-size="large"
                   accesskey="i">Work interruption</vs-button>
        <vs-button vs-color="success"
                   vs-type="filled"
                   v-on:click="skip"
                   v-if="resting"
                   vs-icon="skip_next"
                   vs-size="large"
                   accesskey="k">Skip rest break</vs-button>
      </vs-col>
    </vs-row>
  </vs-alert>
</template>

<script>
import { mapMutations } from 'vuex';

import {
  WORK_INTERVAL_COMPLETED,
  WORK_INTERVAL_INTERRUPTED,
  WORK_ADD_TASK,
} from '../store/mutations';

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
const COUNTDOWN = 0.2; //25; // 0.1
const REST_COUNTDOWN = 0.2; //5; // 0.1
const LONG_REST_COUNTDOWN = 0.5; //15; // 0.25
const LONG_REST_EVERY = 4;

export default {
  name: 'Timer',
  data: () => ({
    timer: 'work',
    count: 0,
    counting: false,
    endTime: 0,
    target: 10,
    task: '',
  }),
  props: {
    now: {
      type: Function,
      default: () => Date.now(),
    },
  },
  computed: {
    completedCount() {
      return this.$store.state.completed;
    },
    failedCount() {
      return this.$store.state.failed;
    },
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
          return REST_COUNTDOWN;
        }

        return LONG_REST_COUNTDOWN;
      }

      return COUNTDOWN;
    },
    color() {
      if (this.isWork()) {
        return 'danger';
      }

      return 'success';
    },
    // Percentage of time remaining
    percentage() {
      const total = this.countdown * 60 * 1000;
      const seconds = Math.floor(this.count / MILLISECONDS_SECOND);

      return Math.floor((seconds / (total / 1000)) * 100);
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
    minutes() {
      const minutes = Math.floor((this.count % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE);
      return Math.floor(minutes);
    },
    seconds() {
      const seconds = (this.count % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND;
      return Math.floor(seconds);
    },
    totalSeconds() {
      const seconds = this.count / MILLISECONDS_SECOND;

      return Math.floor(seconds);
    },
    taskName() {
      return this.task.length > 0 ? this.task : 'Unnamed';
    },
    completedTime() {
      return (this.total - this.count) / 1000;
    },
  },
  methods: {
    ...mapMutations({
      completed: WORK_INTERVAL_COMPLETED,
      interrupted: WORK_INTERVAL_INTERRUPTED,
      addTask: WORK_ADD_TASK,
    }),
    init() {
      this.total = this.countdown * 60 * 1000;
      this.count = this.total;
      this.endTime = this.now() + this.total;
    },
    start() {
      if (this.counting) {
        return;
      }

      this.init();

      this.$emit('timerstart');

      this.counting = true;
      this.next();
    },
    next() {
      this.timeout = setTimeout(this.step.bind(this), 1000);
    },
    step() {
      if (!this.counting) {
        return;
      }

      if (this.count > 0) {
        this.count -= 1000;

        if (this.count > 0) {
          this.$emit('timerprogress', {
            percentage: this.percentage,
            countdown: this.countdown,
            minutes: this.minutes,
            seconds: this.seconds,
            totalSeconds: this.totalSeconds,
          });
        }

        this.next();
      } else {
        this.stop();
      }
    },
    interrupt() {
      if (this.isWork()) {
        this.interrupted();
        this.addTask({
          date: new Date(),
          status: 'failed',
          description: this.taskName,
          time: this.completedTime,
          notes: null,
        });
      }

      this.init();

      this.counting = false;
      clearTimeout(this.timeout);
      this.timeout = undefined;

      this.$emit('timerinterrupt');
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
        this.completed();
        this.addTask({
          date: new Date(),
          status: 'success',
          description: this.taskName,
          time: this.completedTime,
          notes: null,
        });
      }

      this.counting = false;
      this.timeout = undefined;

      if (this.isWork()) {
        this.timer = 'rest';
      } else {
        this.timer = 'work';
      }

      this.init();

      clearTimeout(this.timeout);

      this.$emit('timerend');
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

      return this.completedCount % LONG_REST_EVERY === 0;
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
h1 {
  text-align: center;
  font-size: 750%
}
#stats {
  margin-top: 10px;
  font-weight:bolder
}
.vs-button {
  margin: 2px;
}
</style>
