import Dexie from 'dexie';
// import createFake from '../faker';

const db = new Dexie('pomodoro');

db.version(1).stores({
  tasks: '++id, date, interrupted, description', // notes, time don't need to be indexed
});

// createFake(db);

export default db;
