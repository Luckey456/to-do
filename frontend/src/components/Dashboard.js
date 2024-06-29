import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [searchParams, setSearchParams] = useState({
    title: '',
    status: '',
    priority: '',
    assignedTo: '',
    dueDate: '',
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5001', { query: { token: auth } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [auth]);

  useEffect(() => {
    if (socket) {
      socket.on('taskCreated', (task) => setTasks((prev) => [...prev, task]));
      socket.on('taskUpdated', (updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
      });
      socket.on('taskDeleted', (taskId) => {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
      });
    }
  }, [socket]);

  const fetchTasks = async () => {
    const query = new URLSearchParams(searchParams).toString();
    const response = await axios.get(`/api/tasks?${query}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setTasks(response.data);
    };
  
    useEffect(() => {
      fetchTasks();
    }, [auth, searchParams]);
  
    const createTask = async () => {
      const newTask = {
        title: taskTitle,
        description: '',
        dueDate: null,
        priority: 'medium',
        status: 'incomplete',
        assignedTo: null,
      };
      const response = await axios.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      socket.emit('taskCreated', response.data);
      setTaskTitle('');
    };
  
    const handleSearchChange = (e) => {
      setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };
  
    return (
      <div>
        <h1>Dashboard</h1>
        <input
          type="text"
          placeholder="New task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button onClick={createTask}>Create Task</button>
        
        <div>
          <h3>Search and Filters</h3>
          <input
            type="text"
            name="title"
            placeholder="Search by title"
            onChange={handleSearchChange}
          />
          <select name="status" onChange={handleSearchChange}>
            <option value="">All Statuses</option>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>
          <select name="priority" onChange={handleSearchChange}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          name="assignedTo"
          placeholder="Assigned To"
          onChange={handleSearchChange}
        />
        <input
          type="date"
          name="dueDate"
          onChange={handleSearchChange}
        />
        <button onClick={fetchTasks}>Search</button>
      </div>
      
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
  