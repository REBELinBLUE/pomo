import Dexie from 'dexie';

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

// eslint-disable-next-line
Task.prototype.save = function () {
  return db.tasks.put(this);
};

const tasks = JSON.parse(window.localStorage.getItem('pomodoro:tasks') || '[]');
tasks.forEach((item) => {
  const task = new Task({
    ...item,
    date: new Date(item.date),
  });

  task.save();
});
window.localStorage.removeItem('pomodoro:tasks');

export default db;

export { Task };
