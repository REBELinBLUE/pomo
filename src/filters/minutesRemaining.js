const SECONDS_MINUTE = 60;
const SECONDS_HOUR = 60 * SECONDS_MINUTE;

export default function minutesRemaining(value) {
  let remaining = Math.floor(Math.floor((value % SECONDS_HOUR) / SECONDS_MINUTE));

  if (remaining < 0) {
    remaining = 0;
  }

  return remaining;
}
