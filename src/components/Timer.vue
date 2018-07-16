<template>
  <vs-row>
    <vs-col vs-offset="2" vs-type="flex" vs-justify="center" vs-align="center" vs-w="8">
      <vs-alert vs-active="true" :vs-color="color">
        <vs-progress :vs-height="8" :vs-percent="remaining" :vs-color="color" />
        <h1>{{ minutes }}:{{ seconds }}</h1>
        <span v-on:click="start" v-if="stopped">Start</span>
        <span v-on:click="interrupt" v-if="running">Interruption!</span>

        <h2>Completed: {{ completed }}</h2>
        <h2>Interruptions: {{ failed }}</h2>
      </vs-alert>
    </vs-col>
  </vs-row>
</template>

<script>
const MILLISECONDS_SECOND = 1000;
const MILLISECONDS_MINUTE = 60 * MILLISECONDS_SECOND;
const MILLISECONDS_HOUR = 60 * MILLISECONDS_MINUTE;
const COUNTDOWN = 25;
const REST_COUNTDOWN = 5;
const LONG_REST_COUNTDOWN = 15;
const LONG_REST_EVERY = 4;

export default {
  name: 'Timer',
  data: () => ({
    countdown: COUNTDOWN,
    timer: 'work',
    failed: 0,
    completed: 0,
    color: 'primary',
    count: 0,
    counting: false,
    endTime: 0,
  }),
  props: {
    now: {
      type: Function,
      default: () => Date.now(),
    },
  },
  computed: {
    remaining() {
      const total = this.countdown * 60 * 1000;
      const seconds = Math.floor(this.count / MILLISECONDS_SECOND);

      const res = Math.floor((seconds / (total / 1000)) * 100);

      console.log(res);

      return res;
    },
    running() {
      return this.counting;
    },
    stopped() {
      return !this.counting;
    },
    minutes() {
      const minutes = Math.floor((this.count % MILLISECONDS_HOUR) / MILLISECONDS_MINUTE);
      const preprocess = value => (value < 10 ? `0${value}` : value);

      return preprocess(Math.floor(minutes));
    },
    seconds() {
      const seconds = (this.count % MILLISECONDS_MINUTE) / MILLISECONDS_SECOND;
      const preprocess = value => (value < 10 ? `0${value}` : value);

      return preprocess(Math.floor(seconds));
    },
    totalSeconds() {
      const seconds = this.count / MILLISECONDS_SECOND;

      return Math.floor(seconds);
    },
  },
  methods: {
    init() {
      const time = this.countdown * 60 * 1000;

      this.count = time;
      this.endTime = this.now() + time;
    },
    start() {
      if (this.counting) {
        return;
      }

      this.init();

      if (this.timer === 'work') {
        this.color = 'danger';
      } else {
        this.color = 'success';
      }

      this.$emit('timerstart');

      this.counting = true;
      this.next();
    },
    // pause() {
    //   if (!this.counting) {
    //     return;
    //   }
    //
    //   this.$emit('timerpause');
    //
    //   this.counting = false;
    //   clearTimeout(this.timeout);
    // },
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
            remaining: this.remaining,
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
      if (this.timer === 'work') {
        this.failed = this.failed + 1;
      }

      this.counting = false;
      clearTimeout(this.timeout);
      this.timeout = undefined;

      this.color = 'primary';

      this.$emit('timerinterrupt');
    },
    stop() {
      this.count = 0;
      if (this.timer === 'work') {
        this.completed = this.completed + 1;
      }
      this.counting = false;
      this.timeout = undefined;

      if (this.timer === 'work') {
        this.color = 'success';
        this.timer = 'rest';
        console.log(this.completed % LONG_REST_EVERY );
        this.countdown = this.completed % LONG_REST_EVERY > 0 ? REST_COUNTDOWN : LONG_REST_COUNTDOWN;
      } else {
        this.color = 'danger';
        this.timer = 'work';
        this.countdown = COUNTDOWN;
      }

      clearTimeout(this.timeout);

      this.$emit('timerend');
    },
    update() {
      if (this.counting) {
        this.count = Math.max(0, this.endTime - this.now());
      }
    },
  },
  watch: {
    time() {
      this.init();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  text-align: center;
  font-size: 500%
}
</style>
