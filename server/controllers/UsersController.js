const usersService = require("../services/UsersService");

exports.getAllUsers = async (req, res) => {
    try {
        
        const users = await usersService.getAllUsers();
        
        res.json({ data: users, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUsers = async (req, res) => {
    
    try {
        const users = await usersService.createUsers(req.body);
        res.json({ data: users, status: "success" });
        console.log(req.body)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUsersById = async (req, res) => {
    try {
        const users = await usersService.getUsersById(req.params.id);
        res.json({ data: users, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUsers = async (req, res) => {
    try {
        const users = await usersService.updateUsers(req.params.id, req.body);
        res.json({ data: users, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUsers = async (req, res) => {
    try {
        const users = await usersService.deleteUsers(req.params.id);
        res.json({ data: users, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
