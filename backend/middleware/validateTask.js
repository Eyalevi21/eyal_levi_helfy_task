const validateTask = (req, res, next) => {
    const { title, description, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "Title is required and must be a valid string" });
    }

    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: "Description is required and must be a valid string" });
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (!priority || !validPriorities.includes(priority)) {
        return res.status(400).json({ error: "Priority must be 'low', 'medium', or 'high'" });
    }



    next();
};

module.exports = validateTask;