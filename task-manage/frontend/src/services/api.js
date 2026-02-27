const API_URL = 'http://localhost:4000/api/tasks';


export const fetchTasks = async (status = 'all', page = 1, limit = 20) => {
    const url = `${API_URL}?status=${status}&page=${page}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
};

export const createTask = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
};

export const updateTask = async (id, taskData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete task');
    return await response.json();
};

export const toggleTaskCompletion = async (id) => {
    const response = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' });
    if (!response.ok) throw new Error('Failed to toggle task status');
    return await response.json();
};