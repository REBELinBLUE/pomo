import Dexie from 'dexie';

const db = new Dexie('pomodoro');

db.version(1).stores({
  tasks: '++id, date, interrupted, description', // notes, time don't need to be indexed
});

export default db;
