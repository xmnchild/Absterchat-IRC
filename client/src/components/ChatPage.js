import React, { useEffect, useState, useRef } from 'react';
import ChatBar from './ChatBar';
import ChatRightBar from './ChatRightBar'
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import ChatLeftSideBar from './ChatLeftSideBar';

const ChatPage = ({ socket, newNickname }) => {
    const [messages, setMessages] = useState([]);
    const [messagesPrive, setMessagesPrive] = useState([]);
    const lastMessageRef = useRef(null);
    const [allChannels, setallChannels] = useState([]);
    const [allChannelsSql, setallChannelsSql] = useState([]);
    const [actualRoom, setActualRoom] = useState(localStorage.getItem('actualRoom'));
    const [oldActualdRoom, setOldActualRoom] = useState("");


    socket.on('ResultAllChannels', function (data) {
        if (data != []) {
            setallChannels((data))
        }
    });


    function changeActualRoom(value) {
        setActualRoom(value);
    }

    function changeOldActualRoom(value) {
        setOldActualRoom(value);
    }

    useEffect(() => {
        socket.on('messageResponse', function (data) {
            console.log(data)
            if (data.channel == localStorage.getItem('actualRoom')) {
                setMessages([...messages, data])
            }

        });
        socket.on('changeActualRoomInNewNameChannelInMessages', function (oldNameRoom, newNameRoom) {
            console.log("-----------------------Messages")
            console.log(JSON.stringify(messages))
            let copyMessages = messages;
            copyMessages = copyMessages.map(function (element) {
                if (element.channel == oldNameRoom) {
                    element.channel = newNameRoom
                    return element;
                }
                return element;
            })
            console.log("-----------------------copyMessages")
            console.log(JSON.stringify(copyMessages))
            setMessages(copyMessages);
        });

        socket.on('changeUsernameInMessages', function (oldNameUser, newNameUser) {
            console.log("-----------------------Messages")
            console.log(JSON.stringify(messages))
            let copyMessages = messages;
            copyMessages = copyMessages.map(function (element) {
                if (element.name == oldNameUser) {
                    element.name = newNameUser
                    return element;
                }
                return element;
            })
            console.log("-----------------------copyMessages CHANGE USERNAME")
            console.log(JSON.stringify(copyMessages))
            if (localStorage.getItem('actualRoom') == oldNameUser) {
                localStorage.setItem('actualRoom', newNameUser)
                setActualRoom(newNameUser)
            }

            setMessages(copyMessages);
        });


    }, [socket, messages]);


    useEffect(() => {
        socket.on('messageResponsePrive', function (data) {
            console.log(data)

            setMessagesPrive([...messagesPrive, data])

        });
        socket.on('changeUsernameInMessagesPrive', function (oldNameUser, newNameUser) {
            console.log("-----------------------Messages Prive")
            console.log(JSON.stringify(messagesPrive))
            let copyMessagesPrive = messagesPrive;
            copyMessagesPrive = copyMessagesPrive.map(function (element) {
                if (element.name == oldNameUser) {
                    element.name = newNameUser
                }
                element.two.forEach(function (x, i) {
                    if (x == oldNameUser) {
                        element.two[i] = newNameUser;
                    }
                });
                console.log("-----------------------element")
                console.log(JSON.stringify(element))
                return element;
            })
            console.log("-----------------------copyMessagesPrive CHANGE USERNAME")
            console.log(JSON.stringify(copyMessagesPrive))
            if (localStorage.getItem('actualRoom') == oldNameUser) {
                localStorage.setItem('actualRoom', newNameUser)
                setActualRoom(newNameUser)
            }

            setMessagesPrive(copyMessagesPrive);
        });
    }, [socket, messagesPrive]);



    useEffect(() => {

        socket.on('removeActualRoom', async function (data) {
            if (data.deleteRoom == localStorage.getItem('actualRoom')) {
                localStorage.setItem('actualRoom', '')
                setActualRoom('')
            }
        })


        socket.on('user_id', async function (user_id) {

            if (user_id != null) {
                localStorage.setItem('user_id', user_id);
            }
        })


        socket.on('changeUsernameInMessages', function (oldNameUser, newNameUser) {
            console.log("-----------------------Messages")
            console.log(JSON.stringify(messages))
            let copyMessages = messages;
            copyMessages = copyMessages.map(function (element) {
                if (element.name == oldNameUser) {
                    element.name = newNameUser
                    return element;
                }
                return element;
            })
            console.log("-----------------------copyMessages CHANGE USERNAME")
            console.log(JSON.stringify(copyMessages))
            setMessages(copyMessages);
        });




    }, [socket]);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        console.log(messages);
    }, [messages]);


    useEffect(() => {

        socket.on('ResultAllChannels', function (data) {
            if (data != []) {
                setallChannels((data))
            }
        });
        localStorage.setItem('allChannels', allChannels);


    }, [socket, allChannels]);


    useEffect(() => {
        socket.on('ResultAllChannels', function (data) {
            if (data != []) {
                setallChannels((data))
            }
        });
        localStorage.setItem('allChannels', allChannels);

    }, [allChannels]);







    useEffect(() => {
        socket.on('updateAfterDeleteChannl', function (dataMongo, deleteRoom) {
            if (dataMongo != []) {
                console.log("------------------------------------MISE A JOUR CHANNEL MONGO version 2")
                console.log(JSON.stringify(dataMongo))
                setallChannelsSql((dataMongo))
                if (deleteRoom == localStorage.getItem('actualRoom')) {
                    localStorage.setItem('actualRoom', '')
                    setActualRoom('');

                }
            }
        });
        socket.emit('GetAllChannels');
        socket.on('ResultAllChannelsSqlFor' + localStorage.getItem('userName'), function (data) {
            if (data != []) {
                setallChannelsSql((data))
            }
        });
        socket.on('ResultAllChannels', function (data) {
            if (data != []) {
                setallChannels((data))
            }
        });
        localStorage.setItem('allChannels', allChannels);
        socket.on('changeActualRoomInNewNameChannel', function (oldNameRoom, newNameRoom) {
            if (oldNameRoom == localStorage.getItem('actualRoom')) {
                localStorage.setItem('actualRoom', newNameRoom)
                setActualRoom(newNameRoom);

            }
            if (oldNameRoom == localStorage.getItem('oldActualRoom')) {
                localStorage.setItem('oldActualRoom', newNameRoom)
                changeOldActualRoom(newNameRoom);

            }
        });

    }, [socket]);

    useEffect(() => {
        socket.on('ResultAllChannelsSqlForAll', function (data) {
            if (data != []) {
                setallChannelsSql((data))
            }
        });
    }, [socket, allChannelsSql]);

    useEffect(() => {
        console.log(allChannelsSql)
    }, [allChannelsSql]);

    useEffect(() => {
        console.log(allChannels)
    }, [allChannels]);

    useEffect(() => {
        console.log(messagesPrive)
    }, [messagesPrive]);



    useEffect(() => {
        console.log(allChannels)
        let allChannelsByUserSocket = [];
        allChannels.filter(channel => channel.insideRoom.some(inside => inside.user === localStorage.getItem('user_id')))
            .map((item, index) => {
                allChannelsByUserSocket.push(item.nameRoom)
            })
        localStorage.setItem('allChannelsSocket', allChannelsByUserSocket);
    }, [allChannels])

    useEffect(() => {
        console.log("--------------------------VALEUR messages")
        console.log(messages)
    }, [messages])

    useEffect(() => {
        console.log("--------------------------VALEUR ACTUAL ROOOOOOOM")
        console.log(actualRoom)
    }, [actualRoom])







    return (

        <div className="maindiv-chat flex h-screen border-l borderflex">
            <ChatLeftSideBar socket={socket} />
            <ChatBar socket={socket} allChannels={allChannels} allChannelsSql={allChannelsSql} actualRoom={actualRoom} changeActualRoom={changeActualRoom} changeOldActualRoom={changeOldActualRoom} />

            <div className="chat">
                <div className="chat__main overflow-auto ">
                    <ChatBody messages={messages} messagesPrive={messagesPrive} socket={socket} changeActualRoom={changeActualRoom} changeOldActualRoom={changeOldActualRoom}
                        lastMessageRef={lastMessageRef} />
                    <div className=' border-l bg-white'>
                        <ChatFooter socket={socket} changeActualRoom={changeActualRoom} />

                    </div>
                </div>

                <ChatRightBar socket={socket} allChannels={allChannels} actualRoom={actualRoom} newNickname={newNickname} changeActualRoom={changeActualRoom} changeOldActualRoom={changeOldActualRoom} />

            </div>
        </div>

    );
};

export default ChatPage;