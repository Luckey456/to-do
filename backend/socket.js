const Task = require('./models/Task');

const socketHandler = (io, socket) => {
  socket.on('taskCreated', (task) => {
    io.emit('taskCreated', task);
  });

  socket.on('taskUpdated', (task) => {
    io.emit('taskUpdated', task);
  });

  socket.on('taskDeleted', (taskId) => {
    io.emit('taskDeleted', taskId);
  });
};

module.exports = { socketHandler };
