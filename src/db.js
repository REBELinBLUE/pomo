import Dexie from 'dexie';
// import createFake from '../faker';

const db = new Dexie('pomodoro');

db.version(1).stores({
  tasks: '++id, date, interrupted, description', // This is just the fields which are indexed
});

// FIXME: Maybe change this to ES6
const Task = db.tasks.defineClass({
  id: Number,
  date: Object,
  interrupted: Boolean,
  notes: String,
  description: String,
  time: Number,
});

Task.prototype.save = function () {
  return db.tasks.put(this);
};

// createFake(db);

export default db;

export { Task };
