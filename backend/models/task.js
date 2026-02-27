// This file acts as our in-memory database and data layer

let tasks = []; // Starting fresh with 0 tasks!
let currentId = 1;

// We export the array and a helper function to get the next ID securely
module.exports = {
    tasks,
    generateId: () => currentId++
};