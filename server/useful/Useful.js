
async function userExiste(collectionUsers, data) {
    let confirmation = await collectionUsers.find({ "username": data.channel }).toArray().then(async function (existe) {
        if (existe.length > 0) {
            return true;
        } else {
            return false;
        }
    })
    return confirmation;
}

async function messagesExiste(collectionMessages, data) {
    let messagesExiste = await collectionMessages.find({ "users": { $in: [data.name, data.channel] } }).toArray().then(function (resultat) {
        if (resultat.length > 0) {
            resultat.map(function (element, index) {
                console.log("------------------ajoute dans content le message privé que users a envoyé------")

                let insertText = addTextInMessagePrive(collectionMessages, data, element.content).then(function (res) { return res })
                if (insertText) {
                    return true;
                } else {
                    return false;
                }
            })
            return resultat;
        } else if (resultat != null && resultat.length == 0) {

            let newMessagePrive = newMessagesPrive(collectionMessages, data)
            if (newMessagePrive) {
                return true;
            } else {
                return false
            }
        }
    })
    if (messagesExiste) {
        return true;
    }
    return false;
}

async function newMessagesPrive(collectionMessages, data) {
    let newMessages = await collectionMessages.insertOne({ users: [data.name, data.channel], content: [data] })
        .then(function (resultat) {
            return true;
        })
    if (newMessages) return true;
    return false;
}

async function addTextInMessagePrive(collectionMessages, data, oldData) {


    oldData.push(data);
    console.log("-------new oldData")
    console.log(oldData)
    let InsertContent = await collectionMessages.updateOne({ "users": { $in: [data.name, data.channel] } }, { $set: { content: oldData } }).then(function (resultat) {
        return true;
    })
    if (InsertContent) return true;
    return false;
}

async function isProprio(collectionChannels, userName, actualRoom) {
    var allItems = await collectionChannels.find({ name: actualRoom, proprio: userName }).toArray().then(function (resultat) {
        if (resultat.length > 0) {
            //console.log(resultat)
            return true;
        } else {
            console.log("false")
            return false;
        }
    });

    if (allItems) return true;
    return false;
}


async function changeNameChannel(collectionChannels, userName, actualRoom, newNameChannel) {
    var allItems = await collectionChannels.find({ name: actualRoom, proprio: userName }).toArray().then(function (resultat) {
        if (resultat.length > 0) {
            resultat.map(async function (element, index) {
                element.content.forEach(function (x) {
                    x.channel = newNameChannel;
                });
                await collectionChannels.updateOne({ name: actualRoom }, { $set: { name: newNameChannel, content: element.content } }).then(function (result) {
                })
            })
            return true;
        } else {
            console.log("false")
            return false;
        }
    });
    return allItems
}


async function changeNameRoomInUsers(actualRoom, newNameChannel, users) {
    let newusers = [];
    users.map(function (element, index) {
        if (element.room == actualRoom) {
            element.room = newNameChannel
        }
        newusers.push(element);
    });

    return newusers;
}


async function changeNameRoomInAllChannels(actualRoom, newNameChannel, allChannels) {
    let newAllChannels = [];
    allChannels.map(function (element, index) {
        if (element.nameRoom == actualRoom) {
            element.nameRoom = newNameChannel
        }
        newAllChannels.push(element);
    });
    return newAllChannels;
}


async function messagesExisteMaybeChangeNickname(collectionMessages, data) {
    console.log("--------------------------------------messagesExisteMaybeChangeNickname")
    let messagesExiste = await collectionMessages.find({ "users": { $in: [data.oldName] } }).toArray().then(function (resultat) {
        if (resultat.length > 0) {
            console.log("--------------------------------------message privé existant")
            resultat.map(async function (element, index) {
                console.log("------------------modification de chaque element------")
                if (element.users.includes(data.oldName)) {
                    var arraysUsers = element.users.map(function (x) { return x.replace(data.oldName, data.newName); });
                }
                element.content.map(function (item, index) {
                    if (item.channel == data.oldName) {
                        item.channel = data.newName
                    }
                    if (item.name == data.oldName) {
                        item.name = data.newName
                    }
                    item.two.forEach(function (x, i) {
                        if (x == data.oldName) {
                            item.two[i] = data.newName;
                        }
                    });
                    console.log("-----------------------------------item.two")
                    console.log(item.two)
                    console.log("-----------------------------------item")
                    console.log(item)
                    return item;
                })
                let InsertContent = await collectionMessages.updateOne({ "users": { $in: [data.oldName] } }, { $set: { users: arraysUsers, content: element.content } }).then(function (resultat) {
                    return true;
                })
            })
            return true;
        } else if (resultat != null && resultat.length == 0) {
            return false
        }
    })
    if (messagesExiste) {
        return true;
    }
    return false;
}

module.exports = { userExiste, messagesExiste, newMessagesPrive, addTextInMessagePrive, isProprio, changeNameChannel, changeNameRoomInUsers, changeNameRoomInAllChannels, messagesExisteMaybeChangeNickname };