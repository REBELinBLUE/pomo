<template>
  <vs-alert vs-active="true" :vs-color="color">
    <vs-progress :vs-height="8" :vs-percent="percentage" :vs-color="color" />

    <vs-row id="stats">
      <vs-col vs-type="flex" vs-justify="flex-start" vs-align="center" vs-w="4">
        <h2>{{ label }}</h2>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
        <vs-input vs-icon="alarm" placeholder="Enter task name..." v-model="task" v-if="!resting" />
        &nbsp;
      </vs-col>
      <vs-col vs-type="flex" vs-justify="flex-end" vs-align="center" vs-w="4">
        <Summary :completed="completedCount" :target="targetCount" :failed="failedCount" />
      </vs-col>
    </vs-row>

    <!-- FIXME: count is milliseconds not seconds -->
    <Countdown :seconds="count" />

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

      <!-- FIXME: This should be in the bottom right corner -->
      <router-link to="/settings" v-if="stopped">
        <vs-button vs-color="primary" vs-type="border" vs-icon="settings" />
      </router-link>
    </vs-row>
  </vs-alert>
</template>

<script>
import { mapMutations } from 'vuex';
import { WORK_ADD_TASK } from '@/store/constants';
import Countdown from '@/components/Timer/Countdown.vue';
import Summary from '@/components/Timer/Summary.vue';

const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;

export default {
  name: 'Timer',
  components: {
    Countdown,
    Summary,
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
    totalSeconds() {
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
      this.count = this.total;
      this.endTime = this.now + this.total;
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
      this.timeout = setTimeout(this.step.bind(this), MILLISECONDS_SECOND);
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
        this.addTask({
          date: new Date(),
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
        this.addTask({
          date: new Date(),
          interrupted: false,
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
        this.count = Math.max(0, this.endTime - this.now);
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
