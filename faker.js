import faker from 'faker'; // eslint-disable-line
import Dexie from 'dexie';

const description = () => {
  if (faker.random.number(1000) >= 950) {
    return faker.lorem.words();
  }
  return faker.helpers.replaceSymbols('???-###').toUpperCase();
};

export default (db) => {
  const CREATE = 1000;
  const tasks = [];
  for (let i = 0; i < CREATE; i += 1) {
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

    tasks.push({
      date,
      time,
      notes,
      interrupted,
      description: description(),
    });
  }

  for (let i = 1; i < faker.random.number(10); i += 1) {
    const interrupted = faker.random.boolean();
    let time = 25 * 60;
    let notes = null;
    if (interrupted) {
      time = faker.random.number(time);
      notes = faker.lorem.lines();
    }

    tasks.push({
      date: new Date(),
      time,
      notes,
      interrupted,
      description: description(),
    });
  }

  db.tasks.bulkPut(tasks).then((lastKey) => {
    console.log('Done putting 100,000 tasks all over the place');
    console.log(`Last task's id was: ${lastKey}`);
  }).catch(Dexie.BulkError, (e) => {
    console.error(`Some tasks did not succeed. However, ${100000 - e.failures.length} tasks was added successfully`);
  });
};
