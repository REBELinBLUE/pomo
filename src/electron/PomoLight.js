const noble = require('@s524797336/noble-mac');
const debug = require('debug')('pomo:light');
const { EventEmitter } = require('events');

const SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e';
const WRITE_UUID = '6e400002b5a3f393e0a9e50e24dcca9e';

class PomoLight extends EventEmitter {
  constructor(prefix = 'Pomo Light', serviceUUID = SERVICE_UUID, writeUUID = WRITE_UUID) {
    super();

    this.prefix = prefix;
    this.serviceUUID = serviceUUID;
    this.writeUUID = writeUUID;
    this.foundDevices = {};
    this.connected = false;
    this.stream = null;
    this.peripheral = null;
    this.state = null;
    this.foundDevice = false;

    noble.on('discover', (peripheral) => {
      this.onDiscover(peripheral);
    });

    this.start();
  }

  start() {
    debug('Start noble');

    noble.on('stateChange', (state) => {
      this.onStateChange(state);
    });
  }

  onDiscover(peripheral) {
    const name = peripheral.advertisement.localName || '';

    debug(`Found device id: ${peripheral.id}, name: ${name}, connectable: ${peripheral.connectable}`);

    if (name.startsWith(this.prefix) && peripheral.connectable) {
      this.foundDevices[name] = peripheral;
      this.emit('foundNewDevice', peripheral, this.foundDevices);
    }
  }

  onStateChange(state) {
    this.state = state;

    debug(`State change ${state}`);

    if (state === 'poweredOn') {
      this.startScanning();
    } else {
      this.stopScanning();
    }
  }

  reset() {
    this.connected = false;
    this.foundDevice = false;
    this.stream = null;
    this.peripheral = null;
  }

  startScanning() {
    debug('Start scanning');

    this.reset();

    // FIXME: Should be able to supply the UUID here but for some reason it isn't working
    noble.startScanning(
      [], // [this.serviceUUID],
      false,
    );
  }

  stopScanning() {
    debug('Stop scanning');

    noble.stopScanning();
  }

  connect(peripheral) {
    if (peripheral.state !== 'disconnected') {
      return;
    }

    debug(`Connect to ${peripheral.id}, name: ${peripheral.advertisement.localName}`);

    this.foundDevice = true;
    this.stopScanning();
    peripheral.connect();

    peripheral.once('disconnect', () => {
      debug('Peripheral disconnected');
      this.emit('disconnected');
      this.startScanning(); // FIXME: Hmm, not sure this is right
    });

    peripheral.once('connect', () => {
      debug('Peripheral connected');

      this.peripheral = peripheral;
      this.connected = true;

      // FIXME: Should be able to supply the UUID here but for some reason it isn't working
      peripheral.discoverSomeServicesAndCharacteristics(
        [this.serviceUUID],
        [this.writeUUID],
        (err, services, characteristics) => {
          if (err) {
            console.log(err);
          }

          debug('Peripheral discover services');

          if (characteristics.length === 1) {
            const [stream] = characteristics;
            this.stream = stream;
            this.emit('connected');
          }
        },
      );
    });
  }

  disconnect() {
    // FIXME: This need to actually disconnect the device
    if (this.peripheral) {
      debug('Disconnect');

      this.peripheral.disconnect();
    }
op
    this.reset();
  }

  changeColour(red, green, blue) {
    if (this.connected && this.stream) {
      this.stream.write(Buffer.from([0, red, green, blue]), true);

      return true;
    }

    return false;
  }

  setColour(colour) {
    const colours = {
      red: { r: 255, g: 0, b: 0 },
      green: { r: 0, g: 255, b: 0 },
      blue: { r: 0, g: 0, b: 255 },
      orange: { r: 255, g: 69, b: 0 },
    };

    if (colours[colour]) {
      const { r, g, b } = colours[colour];

      this.changeColour(r, g, b);
    }
  }
}

export default PomoLight;
