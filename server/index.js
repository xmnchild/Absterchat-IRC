const express = require('express');
const app = express();
const usersRouter = require("./routes/UsersRoutes");
const PORT = 4000;
const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const mongoose = require("mongoose");
const blogRouter = require("./routes/BlogRoutes");
const channelRouter = require("./routes/ChannelRoutes");
const messageRouter = require("./routes/MessagesRoutes");
const useful = require("./useful/Useful");
let users = [];

let allChannels = [];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    const announce = `User ${socket.id} joined the chat`

    socket.on("deleteChannels", async function (data) {
        console.log("delete CHANNELS EST APPELE")
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('channels');
        let searchChannel = await collection.findOne({ name: data.deleteRoom });
        if (searchChannel != null) {
            await collection.deleteMany({ name: data.deleteRoom }, async function (err, result) {
                if (err) {
                    console.log("error")
                } else if (result) {
                    allChannels = allChannels.filter(channel => channel.nameRoom !== data.deleteRoom);
                    users = users.filter(item => item.room !== data.deleteRoom);
                    socketIO.emit('ResultAllChannels', allChannels);
                    socketIO.emit('newUserResponse', users);
                    socketIO.emit('removeActualRoom', data.deleteRoom);

                    let cursor = await collection.find();
                    console.log("ALL CHANNELS IN DB")
                    if (cursor != []) {
                        let allChannelsByUser = await cursor.toArray();
                        let allChannelsSql = []
                        allChannelsByUser.map(function (element) {
                            let insideRoom = [];
                            element.users.forEach((user, index) => {
                                insideRoom.push({ user: user });
                            });
                            allChannelsSql.push({ nameRoom: element.name, insideRoom: insideRoom, proprio: element.proprio });
                        });
                        if (allChannelsByUser != []) {
                            socketIO.emit('updateAfterDeleteChannl', allChannelsSql, data.deleteRoom);
                        }
                    }
                } else {
                    console.log("nul")
                }
            })
        }
    });

    socket.on("deleteChannelCommand", async function (data) {
        console.log("delete CHANNELS EST APPELE")
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('channels');
        let searchChannel = await collection.findOne({ name: data.deleteRoom });
        console.log(data.deleteRoom);
        if (searchChannel != null) {
            await collection.deleteMany({ name: data.deleteRoom }, async function (err, result) {
                if (err) {
                    console.log("error")
                } else if (result) {
                    allChannels = allChannels.filter(channel => channel.nameRoom !== data.deleteRoom);
                    users = users.filter(item => item.room !== data.deleteRoom);
                    socketIO.emit('ResultAllChannels', allChannels);
                    socketIO.emit('newUserResponse', users);
                    socketIO.emit('removeActualRoom', data.deleteRoom);

                    let cursor = await collection.find();
                    console.log("ALL CHANNELS IN DB")
                    if (cursor != []) {
                        let allChannelsByUser = await cursor.toArray();
                        let allChannelsSql = []
                        allChannelsByUser.map(function (element) {
                            let insideRoom = [];
                            element.users.forEach((user, index) => {
                                insideRoom.push({ user: user });
                            });
                            allChannelsSql.push({ nameRoom: element.name, insideRoom: insideRoom, proprio: element.proprio });
                        });
                        if (allChannelsByUser != []) {
                            let deleteroom = data.deleteRoom;
                            socketIO.emit('updateAfterDeleteChannl', allChannelsSql, deleteroom);
                        }
                    }
                } else {
                    console.log("nul")
                }
            })
        }
    });

    socket.on("changeChannels", async function (data) {
        console.log("CHANGE CHANNELS EST APPELE")
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('users');
        allChannels.map(function (element, index) {
            if (element.nameRoom == data.room) {
                element.insideRoom.forEach((row, indexrow) => {
                    if (Object.values(row).includes(data.userName)) {
                        Object.entries(row).forEach(([key, value]) => {
                            if (value == data.userName) {
                                element.insideRoom.splice(indexrow, 1)

                                return;
                            }
                        }
                        )
                    }
                });

            }
        })
        console.log("____________ ALL CHANNELS BACK")
        console.log(allChannels);
        console.log("PREPARATION update CHANNELS");
        let contain = allChannels.some(x => x.nameRoom.includes(data.futureRoom));
        console.log(contain);
        if (contain) {
            allChannels.map(function (element, index) {
                if (element.nameRoom == data.futureRoom) {
                    element.insideRoom.push({ user: data.userName });
                }
            })
        }
        else {
            const collection = db.collection('channels');
            allChannels.push({ nameRoom: data.futureRoom, insideRoom: [{ user: data.userName }], proprio: data.people });
            allChannels.map(function (element, index) {
                console.log(element.insideRoom)
            })
        }
        let newUser = {
            userName: data.people,
            password: data.password,
            socketID: data.userName,
            room: data.futureRoom
        }
        let isDuplicate = users.some(user => user.userName === newUser.userName && user.room === newUser.room);
        if (!isDuplicate) {
            users.push(newUser);
        }
        console.log(allChannels);
        socketIO.emit('ResultAllChannels', allChannels);

        // message welcome
        let bot = await collection.findOne({ username: "bot", password: "bot" });

        if (bot != null) {
            let welcome = {
                text: 'Welcome to ' + data.people + ' who just joined the chat !',
                name: 'Bot',
                id: bot._id.toString(),
                channel: data.futureRoom,
            }
            socketIO.emit('messageResponse', welcome);
        }
        console.log("---------------------------------------avant users-------------------------")
        console.log(users)
        users = users.filter(element => !(element.room == data.room && data.userName == element.socketID));
        console.log("---------------------------------------apres users-------------------------")
        console.log(users)
        socketIO.emit('newUserResponse', users);

    });

    socket.on('create', async function (room, people) {
        socket.emit('user_id', socket.id);
        socket.join(room);
        let nameRoom = room
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('channels');

        let searchChannel = await collection.findOne({ name: room });
        if (searchChannel == null) {
            let FuturUsers = (new Array(...socketIO.sockets.adapter.rooms.get(nameRoom)).join(', '))
            FuturUsers = FuturUsers.split(', ')
            let UsersForSql = [];
            FuturUsers.forEach((user, index) => {
                users.forEach((value, index) => {
                    if (value.socketID == user) {
                        UsersForSql.push(value.userName);
                    }
                });
            });
            await collection.insertOne({ name: room, users: UsersForSql, content: [], proprio: people });
            allChannels.push({ nameRoom: room, insideRoom: [{ user: socket.id }], proprio: people });
            socketIO.emit('ResultAllChannels', allChannels);


        } else {
            people = searchChannel.proprio;
            let FuturUsers = (new Array(...socketIO.sockets.adapter.rooms.get(nameRoom)).join(', '))
            FuturUsers = FuturUsers.split(', ')
            let UsersForSql = [];
            UsersForSql = searchChannel.users;
            FuturUsers.forEach((user, index) => {
                users.forEach((value, index) => {
                    if (value.socketID == user && searchChannel.users.includes(value.userName) == false) {
                        UsersForSql.push(value.userName);
                    }
                });
            });
            let myquery = { name: room };
            let newvalues = { $set: { users: UsersForSql } };

            await collection.updateOne(myquery, newvalues);
        }
        let UserInsideRoom = (new Array(...socketIO.sockets.adapter.rooms.get(nameRoom)).join(', '))
        let insideRoom = [];
        UserInsideRoom = UserInsideRoom.split(', ')
        UserInsideRoom.forEach((user, index) => {
            insideRoom.push({ user: user });
        });
        let index = allChannels.forEach(function (currentValue, index, arr) {
            if (currentValue.nameRoom == nameRoom) {
                allChannels.splice(index, 1);
                return index;
            } else {
                return null;
            }
        })
        allChannels.push({ nameRoom: room, insideRoom: insideRoom, proprio: people });
        socketIO.emit('ResultAllChannels', allChannels);
    });

    socket.on('changeNameRoom', async function (newNameChannel, userName, userId, actualRoom, callback) {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collectionChannels = db.collection('channels');
        let searchChannel = await useful.isProprio(collectionChannels, userName, actualRoom);
        console.log(searchChannel)
        if (searchChannel) {
            console.log("tu es proprio");
            let changeNameChannel = await useful.changeNameChannel(collectionChannels, userName, actualRoom, newNameChannel);
            if (changeNameChannel) {
                console.log("channel mongo name changé ok")
                var sql = collectionChannels.find().toArray().then(function (token) {
                    let allChannelsSql = []
                    token.map(function (element) {
                        let insideRoom = [];
                        element.users.forEach((user, index) => {
                            insideRoom.push({ user: user });
                        });
                        allChannelsSql.push({ nameRoom: element.name, insideRoom: insideRoom, proprio: element.proprio });
                    });
                    if (token.length > 0) {
                        console.log(JSON.stringify(allChannelsSql));
                        socketIO.emit('ResultAllChannelsSqlForAll', allChannelsSql)
                    }
                });
                users = await useful.changeNameRoomInUsers(actualRoom, newNameChannel, users);
                socketIO.emit('newUserResponse', users);
                allChannels = await useful.changeNameRoomInAllChannels(actualRoom, newNameChannel, allChannels);
                socketIO.emit('ResultAllChannels', allChannels);
                socketIO.emit('changeActualRoomInNewNameChannel', actualRoom, newNameChannel);
                socketIO.emit('changeActualRoomInNewNameChannelInMessages', actualRoom, newNameChannel);
                callback({ status: 'OK' });
            } else {
                console.log("channel mongo name changé non")
                callback({ status: 'fail' });
            }
        } else {
            console.log("tu n es pas proprio");
            callback({ status: 'fail' });
        }
    })

    socket.on('createRoom', async function (room, people, userId) {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('channels');
        let searchChannel = await collection.findOne({ name: room });
        if (searchChannel == null) {

            await collection.insertOne({ name: room, users: [people], content: [], proprio: people });
            var sql = collection.find().toArray().then(function (token) {
                let allChannelsSql = []
                token.map(function (element) {
                    let insideRoom = [];
                    element.users.forEach((user, index) => {
                        insideRoom.push({ user: user });
                    });
                    allChannelsSql.push({ nameRoom: element.name, insideRoom: insideRoom, proprio: element.proprio });
                });
                if (token.length > 0) {
                    socketIO.emit('ResultAllChannelsSqlFor' + people, allChannelsSql);
                }
            });
        }
    })

    socket.on('createChannelCommand', async function (room, usercreate, userId) {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('channels');
        let searchChannel = await collection.findOne({ name: room });
        if (searchChannel == null) {

            await collection.insertOne({ name: room, users: [usercreate], content: [], proprio: usercreate });
            var sql = collection.find().toArray().then(function (token) {
                let allChannelsSql = []
                token.map(function (element) {
                    let insideRoom = [];
                    element.users.forEach((user, index) => {
                        insideRoom.push({ user: user });
                    });
                    allChannelsSql.push({ nameRoom: element.name, insideRoom: insideRoom, proprio: element.proprio });
                });
                if (token.length > 0) {
                    socketIO.emit('ResultAllChannelsSqlFor' + usercreate, allChannelsSql);
                }
            });
        }
    })

    socket.on('message', async (data) => {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        let copyData = data;
        let room = copyData.channel
        const db = client.db('CRUD');
        const collection = db.collection('channels');
        const collectionMessages = db.collection('messages');
        const collectionUsers = db.collection('users');
        let searchChannel = await collection.findOne({ name: room });
        if (searchChannel != null) {
            socketIO.emit('messageResponse', data);
            let oldContent = searchChannel.content;
            if (oldContent == []) {
                oldContent = copyData
            } else {
                oldContent.push(copyData)
            }
            let myquery = { name: room };
            let newvalues = { $set: { content: oldContent } };
            await collection.updateOne(myquery, newvalues);
        }


        //--------------------------------------------PRIVATE MESSAGES---------------------------------------
        if (searchChannel == null) {
            console.log(await useful.userExiste(collectionUsers, data))
            if (await useful.userExiste(collectionUsers, data)) {
                data.two = [data.name, data.channel];
                console.log("user existe")
                let searchMessages = await useful.messagesExiste(collectionMessages, data);
                console.log("socket envoyé")
                console.log(data)
                socketIO.emit('messageResponsePrive', data);
                //}
            } else {
                console.log("user nexiste pas")
            }
        }
    });


    socket.on('loadContent', async (data) => {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });

        const db = client.db('CRUD');
        const collection = db.collection('channels');
        let searchChannel = await collection.findOne({ name: data });
        if (searchChannel != null) {
            socketIO.emit(data + 'Content', searchChannel.content);
        }
    });

    socket.on('newUser', async (data, callback) => {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        //try {
        await client.connect();
        const db = client.db('CRUD');
        const collection = db.collection('users');
        const user = await collection.findOne({ username: data.userName });
        if (user) {
            callback({ status: 'FAILED' });
            console.log('Username already exists');
        } else {
            await collection.insertOne({ username: data.userName, password: data.password });
            callback({ status: 'OK' });
        }
        socketIO.emit('newUserResponse', users);
    });



    //REname name user
    socket.on('renameUserInDB', async (currentUser, newNickname) => {

        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('users');
        const collectionMessages = db.collection('messages');
        let cursor = await collection.find({ username: currentUser });
        await cursor.toArray((err, result) => {

            if (JSON.stringify(result).includes(newNickname)) {
                console.log("This username already exists");
            } else {
                collection.updateOne({ username: currentUser }, { $set: { username: newNickname } }, async (err, res) => {
                    if (res.modifiedCount <= 0) {
                        socket.emit('newNicknameResult', { error: "Error while fetching data from DB" });

                    }
                    else {
                        console.log(res.modifiedCount + " document(s) updated");
                        users.forEach(function (user, index) {
                            if (currentUser == user.userName) {
                                users[index].userName = newNickname;

                            }
                        })

                        socketIO.emit('newUserResponse', users);
                        socketIO.emit('newNicknameResult', newNickname);
                        //CHANNELS MONGO
                        const collectionChannels = db.collection('channels');
                        var allItems = collectionChannels.find().toArray().then(function (token) {
                            if (token.length > 0) {
                                console.log("424----")
                                console.log(token)
                                token.map(async function (element, index) {
                                    if (element.users.includes(currentUser)) {
                                        var resultArr = element.users.map(function (x) { return x.replace(currentUser, newNickname); });
                                    }
                                    if (element.proprio == currentUser) {
                                        element.proprio = newNickname;
                                    }
                                    element.content.map(function (item, index) {
                                        if (item.name == currentUser) {
                                            item.name = newNickname;
                                        }
                                    })
                                    await collectionChannels.updateOne({ name: element.name }, { $set: { users: resultArr, content: element.content, proprio: element.proprio } }).then(function (result) {

                                        if (allChannels != []) {
                                            let allChannelCopy = allChannels
                                            allChannelCopy.map(function (element, index) {
                                                if (element.proprio == currentUser) {
                                                    allChannels[index].proprio = newNickname;
                                                }
                                            });

                                        }
                                    })
                                })
                            }

                        });
                        var sql = collectionChannels.find().toArray().then(function (token) {
                            socketIO.emit('ResultAllChannelsSqlFor' + newNickname, token);

                        });
                        socketIO.emit('ResultAllChannels', allChannels);
                        socketIO.emit('changeUsernameInMessages', currentUser, newNickname);

                        let data = {
                            oldName: currentUser,
                            newName: newNickname
                        }
                        let searchMessages = await useful.messagesExisteMaybeChangeNickname(collectionMessages, data);
                        socketIO.emit('changeUsernameInMessagesPrive', currentUser, newNickname);
                    }
                });
            }
        })
    });


    socket.on("GetAllUsersInRoom", async (channelName) => {
        console.log(users);
        let listUsers = [];
        users.map(function (element) {
            if (element.room == channelName) {
                listUsers.push(element.userName);
            }
        });
        socket.emit('resultAllUsers', listUsers);
    });


    socket.on('GetAllChannels', async () => {
        socketIO.emit('ResultAllChannels', allChannels);
    });


    socket.on('GetAllChannelsInDB', async () => {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('channels');
        let cursor = await collection.find();
        console.log("ALL CHANNELS IN DB")
        if (cursor != []) {
            await cursor.toArray((err, result) => {
                if (err) {
                    console.log(err);
                    socket.emit('ResultAllChannelsInDB', { error: "Error while fetching data from DB" });
                }

                else {
                    if (result.length > 0) {
                        console.log("ALL CHANNELS IN DB IN CUROSR")
                        console.log(result);
                        socket.emit('ResultAllChannelsInDB', result);;
                    } else {
                        console.log("No channels found in DB");
                        socket.emit('ResultAllChannelsInDB', { error: "No channels found in DB" });
                    }

                }
            })

        }
    });

    socket.on('GetAllChannelsByUserSql', async (data) => {
        console.log(socketIO.sockets.adapter.rooms)
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('channels');
        let cursor = await collection.find({ "users": { $in: [data] } });
        if (cursor != null) {
            let allChannelsByUser = await cursor.toArray();
            let allChannelsSql = []
            allChannelsByUser.map(function (element) {
                let insideRoom = [];

                element.users.forEach((user, index) => {

                    insideRoom.push({ user: user });
                });
                allChannelsSql.push({ nameRoom: element.name, insideRoom: insideRoom, proprio: element.proprio });
            });
            if (allChannelsByUser != []) {
                socketIO.emit('ResultAllChannelsSqlFor' + data, allChannelsSql);
            }

        }
    });


    socket.on('Login', async (data, callback) => {
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        try {
            await client.connect();
            const db = client.db('CRUD');
            const collection = db.collection('users');
            let resultat = collection.findOne({ username: data.userName, password: data.password }, async function (err, result) {
                if (err) {
                    console.log("error")
                } else if (result) {
                    users.push(data);
                    callback({ status: 'OK' });
                    socketIO.emit('newUserResponse', users);
                    let bot = await collection.findOne({ username: "bot", password: "bot" });
                    if (bot != null) {
                        let welcome = {
                            text: 'Welcome to ' + data.userName + ' who just joined the chat !',
                            name: 'Bot',
                            id: bot._id.toString(),
                            channel: data.room,
                        }
                        let newRow = 0;
                        let eachElementNameRoom = [];
                        allChannels.map(function (element, index, array) {
                            eachElementNameRoom.push(element.nameRoom);
                        })
                        if (eachElementNameRoom.includes(/*{room :*/data.room/*}*/)) {

                        } else {
                            socket.join(data.room);
                            let UserInsideRoom = (new Array(...socketIO.sockets.adapter.rooms.get(data.room)).join(', '))
                            let insideRoom = [];
                            UserInsideRoom = UserInsideRoom.split(', ')
                            UserInsideRoom.forEach((user, index) => {
                                insideRoom.push({ user: user });
                            });
                            let searchChannel = await collection.findOne({ name: data.room });

                            if (searchChannel != null) {
                                newRow = { nameRoom: data.room, insideRoom: insideRoom, proprio: searchChannel.proprio };
                            }
                        }
                        if (newRow != 0) {
                            allChannels.push(newRow);
                        }
                        socketIO.emit('messageResponse', welcome);
                        socketIO.emit('newUserResponse', users);
                    }
                } else {
                    callback({ error: "null" });
                }
            });
        }
        catch (error) {
            callback({ error: error.message });
        }

    });

    socket.on('leave', async function (data) {
        let copyUsers = users;
        users = users.filter(element => !(element.room == data.room && data.username == element.userName));
        allChannels.map((element, index) => {
            if (element.nameRoom == data.room) {
                element.insideRoom.map((item, indexInside) => {
                    if (item.user == data.id) {
                        element.insideRoom.splice(indexInside, 1);
                        return;
                    }
                })
            }
        });
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        client.connect();
        const db = client.db('CRUD');
        let nameUsers = copyUsers.filter(function (element) { if (element.room == data.room && data.username == element.userName) return element.userName; });
        const collectionUsers = db.collection('users');
        console.log("________NAMEUSERS")
        console.log(JSON.stringify(nameUsers));
        let nameUsersString = JSON.stringify(nameUsers)
        if (typeof nameUsers[0] !== "undefined") {
            console.log("NAMEUSERS")
            console.log(nameUsers)
            console.log("NAMEUSERS 000")
            console.log(nameUsers[0])
            nameUsers = nameUsers[0].userName
            let bot = await collectionUsers.findOne({ username: "bot", password: "bot" });
            let goodbye = {
                text: 'Goodbye to ' + nameUsers + ' who just left the chat !',
                name: 'Bot',
                id: bot._id.toString(),
                socketID: bot.socketID,
                channel: data.room
            }
            socketIO.emit('messageResponse', goodbye);
        }


        const collection = db.collection('channels');
        let objectNosql = collection.findOne({ name: data.room }, async function (err, result) {
            if (err) {
                console.log("error")
            } else if (result) {
                if (result.users.includes(data.username)) {
                    let CleanUsers = result.users.filter(function (element) {
                        return element !== data.username;
                    });
                    let myquery = { name: data.room };
                    let newvalues = { $set: { users: CleanUsers } };
                    let changeDb = collection.updateOne(myquery, newvalues);
                    let cursor = await collection.find({ "users": { $in: [data.username] } })
                    let documents = await cursor.toArray();
                    let allChannelsSql = []
                    documents.map(function (element) {
                        let insideRoom = [];
                        element.users.forEach((user, index) => {
                            insideRoom.push({ user: user });
                        });
                        allChannelsSql.push({ nameRoom: element.name, insideRoom: insideRoom, proprio: element.proprio });
                    });
                    if (documents != []) {
                        socketIO.emit('ResultAllChannelsSqlFor' + data.username, allChannelsSql);
                    }
                }
            } else {
                console.log("null")
            }
        })
        socketIO.emit('newUserResponse', users);
    })

    socket.on("join", async function (data) {
        console.log("JOIN EST APPELE")
        const MongoClient = require('mongodb').MongoClient;
        const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
        const db = client.db('CRUD');
        const collection = db.collection('users');
        const collectionChannels = db.collection('channels');
        allChannels.map(function (element, index) {
            if (element.nameRoom == data.room) {
                element.insideRoom.forEach((row, indexrow) => {
                    if (Object.values(row).includes(data.userName)) {
                        Object.entries(row).forEach(([key, value]) => {
                            if (value == data.userName) {
                                element.insideRoom.splice(indexrow, 1)

                                return;
                            }
                        }
                        )
                    }
                });

            }
        })
        let contain = allChannels.some(x => x.nameRoom.includes(data.futureRoom));
        if (contain) {
            allChannels.map(function (element, index) {
                if (element.nameRoom == data.futureRoom) {
                    element.insideRoom.push({ user: data.userName });
                }
            })
        }
        else {
            const collection = db.collection('channels');
            allChannels.push({ nameRoom: data.futureRoom, insideRoom: [{ user: data.userName }], proprio: data.people });
            allChannels.map(function (element, index) {
                console.log(element.insideRoom)
            })
        }
        let newUser = {
            userName: data.people,
            password: data.password,
            socketID: data.userName,
            room: data.futureRoom
        }
        let isDuplicate = users.some(user => user.userName === newUser.userName && user.room === newUser.room);
        if (!isDuplicate) {
            users.push(newUser);
        }
        console.log(allChannels);
        socketIO.emit('ResultAllChannels', allChannels);

        let bot = await collection.findOne({ username: "bot", password: "bot" });

        if (bot != null) {
            let welcome = {
                text: 'Welcome to ' + data.people + ' who just joined the chat !',
                name: 'Bot',
                id: bot._id.toString(),
                channel: data.futureRoom,
            }
            socketIO.emit('messageResponse', welcome);
        }
        users = users.filter(element => !(element.room == data.room && data.userName == element.socketID));
        socketIO.emit('newUserResponse', users);
        var sql = collectionChannels.find({ name: data.futureRoom }).toArray().then(async function (res) {

            res.map(async function (element, index) {
                element.users.push(data.people)
                console.log("----lalalalalalalalalalala")
                await collectionChannels.updateOne({ name: data.futureRoom }, { $set: { users: element.users } }).then(function (result) {
                })
            })
            var sql = collectionChannels.find().toArray().then(function (token) {
                let allChannelsSql = []
                token.map(function (element) {
                    let insideRoom = [];
                    element.users.forEach((user, index) => {
                        insideRoom.push({ user: user });
                    });
                    allChannelsSql.push({ nameRoom: element.name, insideRoom: insideRoom, proprio: element.proprio });
                });
                if (token.length > 0) {
                    console.log(JSON.stringify(allChannelsSql));
                    socketIO.emit('ResultAllChannelsSqlForAll', allChannelsSql)
                }
            });

        });






    });


    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        let oldusers = users;
        console.log(oldusers);
        console.log("______origin")
        users = users.filter((user) => user.socketID !== socket.id);
        users = users.filter((user) => user.socketID !== socket.id);
        let difference = oldusers.filter(x => !users.includes(x));
        console.log(difference);
        console.log("______difference")
        console.log("---- nouveau tableau");
        console.log(users);
        let peopleleaving = users.filter(async function (user) {
            if (user.socketID !== socket.id) {
                console.log(user)
                console.log("ici -----")
                const MongoClient = require('mongodb').MongoClient;
                const client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
                await client.connect();
                console.log("Connected to MongoDB");
                const db = client.db('CRUD');
                const collection = db.collection('users');
                let bot = await collection.findOne({ username: "bot", password: "bot" });
                if (difference.length > 0) {
                    let goodbye = {
                        text: 'Goodbye to ' + difference[0].userName + ' who just left the chat !',
                        name: 'Bot',
                        id: bot._id.toString(),
                        socketID: bot.socketID,
                        channel: difference[0].room
                    }
                    socketIO.emit('messageResponse', goodbye);
                }

            }

        });
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });


});


app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/channel", channelRouter);
app.use("/api/message", messageRouter);


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});