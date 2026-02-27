const express = require('express');
const router = express.Router();
const { tasks, generateId } = require('../models/task');
const validateTask = require('../middleware/validateTask');
// @route   GET /api/tasks
router.get('/', (req, res) => {
    res.status(200).json(tasks);
});
router.post('/', validateTask, (req, res) => {
    const { title, description, priority } = req.body;

    const newTask = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date(),
        priority: priority
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

router.put('/:id', validateTask, (req, res) => {
    // 1. Get the ID from the URL and convert it to a number
    const taskId = parseInt(req.params.id, 10);

    // 2. Find the index of the task in our array
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    // 3. If the task doesn't exist, return a 404 Not Found error
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    // 4. Extract the updated data from the request body
    const { title, description, priority, completed } = req.body;

    // 5. Update the task. We use the existing task's data and overwrite it with the new data.
    const updatedTask = {
        ...tasks[taskIndex], // Keep the existing id and createdAt
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        // If 'completed' was provided, update it. Otherwise, keep the existing status.
        completed: completed !== undefined ? completed : tasks[taskIndex].completed
    };

    // 6. Save it back into our array
    tasks[taskIndex] = updatedTask;

    // 7. Return the updated task with a 200 OK status
    res.status(200).json(updatedTask);
});

module.exports = router;