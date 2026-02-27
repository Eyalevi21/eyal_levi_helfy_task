const express = require('express');
const router = express.Router();
const { tasks, generateId } = require('../models/task');
const validateTask = require('../middleware/validateTask');
// @route   GET /api/tasks
router.get('/', (req, res) => {
    try {
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// @route   POST /api/tasks
router.post('/', validateTask, (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// @route   PUT /api/tasks/:id
router.put('/:id', validateTask, (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ error: "Task not found" });
        }

        const { title, description, priority, completed } = req.body;

        const updatedTask = {
            ...tasks[taskIndex], // Keep the existing id and createdAt
            title: title.trim(),
            description: description.trim(),
            priority: priority,
            completed: completed !== undefined ? completed : tasks[taskIndex].completed
        };

        tasks[taskIndex] = updatedTask;
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(`Error updating task ${req.params.id}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// @route   DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ error: "Task not found" });
        }

        const deletedTask = tasks.splice(taskIndex, 1);
        res.status(200).json({ message: "Task deleted successfully", task: deletedTask[0] });
    } catch (error) {
        console.error(`Error deleting task ${req.params.id}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// @route   PATCH /api/tasks/:id/toggle
router.patch('/:id/toggle', (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        const task = tasks.find(t => t.id === taskId);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        task.completed = !task.completed;
        res.status(200).json(task);
    } catch (error) {
        console.error(`Error toggling task ${req.params.id}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;