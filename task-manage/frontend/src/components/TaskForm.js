import React, { useState, useEffect } from 'react';

/*
 * TaskForm – shown inside a modal when the user clicks "Add Task" or "Edit".
 * It receives:
 *   onSubmit(taskData)  – called when the form is submitted
 *   editingTask         – a task object if we are editing, or null for a new task
 *   onCancelEdit()      – called when the user cancels (closes the modal)
 */
const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');

    // When editingTask changes, fill the form with that task's data (or reset it)
    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
            setPriority(editingTask.priority);
        } else {
            setTitle('');
            setDescription('');
            setPriority('low');
        }
    }, [editingTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description, priority });
        if (!editingTask) {
            setTitle('');
            setDescription('');
            setPriority('low');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>

            <label htmlFor="title">Title</label>
            <input id="title" type="text" value={title}
                onChange={e => setTitle(e.target.value)} required />

            <label htmlFor="description">Description</label>
            <textarea id="description" value={description}
                onChange={e => setDescription(e.target.value)} required />

            <label htmlFor="priority">Priority</label>
            <select id="priority" value={priority}
                onChange={e => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <div className="form-actions">
                <button type="submit" className="btn-submit">
                    {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button type="button" className="btn-cancel" onClick={onCancelEdit}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default TaskForm;