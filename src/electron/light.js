import Luxafor from 'node-luxafor';

let light;

// FIXME: Add some more colours
const colours = {
  red: { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  orange: { r: 255, g: 69, b: 0 },
};

const connect = () => {
  try {
    light = new Luxafor();
  } catch (e) {
    console.log(e.message);
    light = undefined;
  }
};

const reconnect = () => {
  if (!light) {
    connect();
  }
};

const setRGB = ({ r, g, b }) => {
  reconnect();
  if (light) {
    try {
      light.color(r, g, b).exec();
    } catch (e) {
      console.log(e.message);
      light = undefined;
    }
  }
};

const setColour = (colour) => {
  if (colours[colour]) {
    setRGB(colours[colour]);
  }
};

const setPattern = (pattern) => {
  reconnect();
  if (light) {
    try {
      light.pattern(pattern).exec();
    } catch (e) {
      console.log(e.message);
      light = undefined;
    }
  }
};

const reset = () => {
  reconnect();
  if (light) {
    try {
      light.reset().exec();
    } catch (e) {
      console.log(e.message);
      light = undefined;
    }
  }
};

export default {
  connect,
  setRGB,
  setColour,
  setPattern,
  reset,
};
