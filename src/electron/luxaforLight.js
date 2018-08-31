import Luxafor from 'node-luxafor';

// FIXME: Refactor to be compatible with PomoLight

let luxaforLight;

// FIXME: Add some more colours
const colours = {
  red: { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  orange: { r: 255, g: 69, b: 0 },
};

const connect = () => {
  try {
    luxaforLight = new Luxafor();
  } catch (e) {
    console.log(e.message);
    luxaforLight = undefined;
  }
};

const reconnect = () => {
  if (!luxaforLight) {
    connect();
  }
};

const setRGB = ({ r, g, b }) => {
  reconnect();
  if (luxaforLight) {
    try {
      luxaforLight.color(r, g, b).exec();
    } catch (e) {
      console.log(e.message);
      luxaforLight = undefined;
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
  if (luxaforLight) {
    try {
      luxaforLight.pattern(pattern).exec();
    } catch (e) {
      console.log(e.message);
      luxaforLight = undefined;
    }
  }
};

const reset = () => {
  reconnect();
  if (luxaforLight) {
    try {
      luxaforLight.reset().exec();
    } catch (e) {
      console.log(e.message);
      luxaforLight = undefined;
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
