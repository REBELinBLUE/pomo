export default function zeroPad(value) {
  return (value < 10 ? `0${value}` : value);
}
