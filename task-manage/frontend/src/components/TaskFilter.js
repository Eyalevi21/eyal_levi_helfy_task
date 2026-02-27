import React from 'react';

const TaskFilter = ({ currentFilter, onFilterChange }) => {
    return (
        <div className="task-filter-container">
            <button
                className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange('all')}
            >
                All
            </button>
            <button
                className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
                onClick={() => onFilterChange('completed')}
            >
                Completed
            </button>
            <button
                className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
                onClick={() => onFilterChange('pending')}
            >
                Pending
            </button>
        </div>
    );
};

export default TaskFilter;