const messagesService = require("../services/MessagesService");


exports.getAllMessages = async (req, res) => {
    try {
        
        const messages = await messagesService.getAllUsers();
        
        res.json({ data: messages, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createMessages = async (req, res) => {
    
    try {
        const messages = await messagesService.createUsers(req.body);
        res.json({ data: messages, status: "success" });
        console.log(req.body)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
