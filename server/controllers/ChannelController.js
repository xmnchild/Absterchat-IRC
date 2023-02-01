const { all } = require("../routes/BlogRoutes");
const channelService = require("../services/ChannelService");

exports.getAllChannel = async (req, res) => {
    try {
        const channel = await channelService.getAllChannel();
        
        res.json({ data: channel, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createChannel = async (req, res) => {
    try {
        const channel = await channelService.createChannel(req.body);
        res.json({ data: channel, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getChannelById = async (req, res) => {
    try {
        const channel = await channelService.getChannelById(req.params.id);
        res.json({ data: channel, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateChannel = async (req, res) => {

        try {
            const channel = await channelService.updateChannel(req.params.id, req.body);
            if(channel!=null){
                const channel = await channelService.getChannelById(req.params.id);
                res.json({ data: channel, status: "success" });
            }
            
        } catch (err) {
            res.status(500).json({ error: err.message });
        }

};

exports.deleteChannel = async (req, res) => {
    try {
        const channel = await channelService.deleteChannel(req.params.id);
        res.json({ data: channel, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addUserChannel = async (req, res) => {
    let newUser=req.body.users;
    const Nowchannel = await channelService.getChannelById(req.params.id);
    if(Nowchannel!=null){
        let allUsers=Nowchannel.users;
        let newArray = [].concat(allUsers, newUser);
        req.body.users=newArray;
        try {
            const channel = await channelService.updateChannel(req.params.id, req.body);
            if(channel!=null){
                const channel = await channelService.getChannelById(req.params.id);
                res.json({ data: channel, status: "success" });
            }
            
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
        
};


exports.deleteUserChannel = async (req, res) => {
    let deleteUser=req.body.users;
    const Nowchannel = await channelService.getChannelById(req.params.id);
    if(Nowchannel!=null){
        let allUsers=Nowchannel.users;

        allUsers = allUsers.filter(e => e !== deleteUser);
        req.body.users=allUsers;
        try {
            const channel = await channelService.updateChannel(req.params.id, req.body);
            if(channel!=null){
                const channel = await channelService.getChannelById(req.params.id);
                res.json({ data: channel, status: "success" });
            }
            
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
        
};



exports.addMessageChannel = async (req, res) => {
    let NewMessage=req.body.content;
    const Nowchannel = await channelService.getChannelById(req.params.id);
    if(Nowchannel!=null){
        let allContents=Nowchannel.content;
        allContents.push(NewMessage)
        req.body.content=allContents
        try {
            const channel = await channelService.updateChannel(req.params.id, req.body);
            if(channel!=null){
                const channel = await channelService.getChannelById(req.params.id);
                res.json({ data: channel, status: "success" });
            }
            
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
        
};
