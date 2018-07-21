const faker = require('faker');
const dateFormat = require('dateformat');

const description = () => {
  if (faker.random.number(1000) >= 950) {
    return faker.lorem.words();
  }

  return faker.helpers.replaceSymbols('???-###').toUpperCase();
};

const CREATE = 1000;

module.exports = () => {
  const data = {
    tasks: [],
    settings: {
      interval: 25,
      rest: 5,
      long_rest: 15,
      long_rest_after: 4,
      target: 10,
      autostart: false,
      interval_alarm: true,
      break_alarm: true,
    },
  };

  // Create 100 tasks
  for (let i = 0; i < CREATE; i = i + 1) {
    const interrupted = faker.random.number(1000) >= 650 ? faker.random.boolean() : false;

    let time = 25 * 60;
    let notes = null;
    if (interrupted) {
      time = faker.random.number(time);
      notes = faker.lorem.lines();
    }

    const today = new Date();
    const date = faker.date.between(
      new Date(today.setDate(today.getDate() - 1)),
      new Date(today.setDate(today.getDate() - 180)),
    );

    data.tasks.push({
      date: dateFormat(date, 'isoDateTime'),
      time,
      notes,
      interrupted,
      description: description(),
    });
  }


  for (let i = 1; i < faker.random.number(10); i = i + 1) {
    const interrupted = faker.random.boolean();
    let time = 25 * 60;
    let notes = null;
    if (interrupted) {
      time = faker.random.number(time);
      notes = faker.lorem.lines();
    }

    data.tasks.push({
      date: dateFormat(new Date(), 'isoDateTime'),
      time,
      notes,
      interrupted,
      description: description(),
    });
  }

  return data;
};
