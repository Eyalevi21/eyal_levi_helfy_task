import React from 'react';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-details">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>

                <div className="task-meta">
                    {/* Visual indication of task priority [cite: 74] */}
                    <span className={`priority-badge ${task.priority}`}>
                        {task.priority}
                    </span>
                    <span className="task-date">
                        {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <span className="task-id">ID: {task.id}</span>

            <div className="task-actions">
                {/* Actions for toggling, editing, and deleting [cite: 70, 71, 72] */}
                <button
                    className="btn-toggle"
                    onClick={() => onToggle(task.id)}
                >
                    {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                    className="btn-edit"
                    onClick={() => onEdit(task)}
                >
                    Edit
                </button>
                <button
                    className="btn-delete"
                    onClick={() => {
                        // Adding a simple confirmation before deleting [cite: 71]
                        if (window.confirm('Are you sure you want to delete this task?')) {
                            onDelete(task.id);
                        }
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskItem;