import React, { useState, useEffect, useCallback } from 'react';
import * as api from './services/api';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';

const PAGE_SIZE = 20; // how many tasks to load per request

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false); // are there more pages to load?

  // Load the FIRST page whenever the filter changes (reset everything)
  useEffect(() => {
    setTasks([]);
    setPage(1);
    loadPage(filter, 1, true);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch one page from the server and append it to the list
  const loadPage = async (status, pageNum, replace = false) => {
    try {
      setLoading(true);
      const result = await api.fetchTasks(status, pageNum, PAGE_SIZE);
      // replace=true when we reset (filter changed), else append
      setTasks(prev => replace ? result.tasks : [...prev, ...result.tasks]);
      setHasMore(result.hasMore);
      setError(null);
    } catch {
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Called by TaskList when the user scrolls near the end of the carousel
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(filter, nextPage);
  }, [hasMore, loading, page, filter]);

  const handleSubmit = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await api.updateTask(editingTask.id, taskData);
        setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
      } else {
        const created = await api.createTask(taskData);
        setTasks([...tasks, created]);
      }
      closeForm();
    } catch {
      setError('Failed to save task.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await api.toggleTaskCompletion(id);
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch {
      setError('Failed to update task.');
    }
  };

  const openForm = (task = null) => { setEditingTask(task); setShowForm(true); };
  const closeForm = () => { setEditingTask(null); setShowForm(false); };

  return (
    <div className="app-container">
      <header>
        <h1>Task Manager</h1>
        <button className="btn-open-form" onClick={() => openForm()}>
          + Add Task
        </button>
      </header>

      <main>
        {error && <div className="error-banner">{error}</div>}

        <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

        <section className="tasks-section">
          {loading && tasks.length === 0 ? (
            <p className="loading-msg">Loading tasks...</p>
          ) : (
            <TaskList
              key={filter}
              tasks={tasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={openForm}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
          )}
        </section>
      </main>

      {/* Modal – only rendered when showForm is true */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <TaskForm
              onSubmit={handleSubmit}
              editingTask={editingTask}
              onCancelEdit={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;