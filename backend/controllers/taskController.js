const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  const task = new Task({
    title,
    description,
    dueDate,
    priority,
    assignedTo,
  });
  await task.save();
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const { title, status, priority, assignedTo, dueDate } = req.query;
  let query = {};

  if (title) query.title = { $regex: title, $options: 'i' };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

  const tasks = await Task.find(query).populate('assignedTo', 'username');
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
    const { id } = req.params; // Extract task ID from URL params
    const updates = req.body;   // New task details to update
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  exports.deleteTask = async (req, res) => {
    const { id } = req.params; // Extract task ID from URL params
  
    try {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };