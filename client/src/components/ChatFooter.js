import React, { useEffect, useState } from 'react';
import logoSend from './send.png'

const ChatFooter = ({ socket, allChannels, actualRoom, changeActualRoom, changeOldActualRoom }) => {
    const [message, setMessage] = useState('');
    const [listResults, setListResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [newNickname, setNewNickname] = useState("")

    useEffect(() => {
        console.log(newNickname);
    }, [newNickname]);


    const handleSendMessage = (e) => {
        e.preventDefault();
        console.log(message);
        console.log("____message tapé");
        let string = "";
        if (message.trim() && localStorage.getItem('userName') && localStorage.getItem('actualRoom')) {

            if (message.includes("/quit ")) {

                console.log("entre dans la condition /quite")
                let nameRoomLeave = message;
                nameRoomLeave = nameRoomLeave.replace("/quit ", '')
                console.log(nameRoomLeave)
                socket.emit('leave', { room: nameRoomLeave, username: localStorage.getItem('userName'), id: localStorage.getItem('user_id') });
                changeActualRoom('');
                localStorage.setItem('actualRoom', '');
                socket.emit('GetAllChannelsByUserSql', localStorage.getItem('userName'));
                socket.emit('GetAllChannels');

            }



            else if (message.startsWith("/list [")) {
                console.log("entre dans la condition /list (string)")
                socket.emit('GetAllChannelsInDB');
                socket.on('ResultAllChannelsInDB', (data) => {
                    let channelNames = data.map(data => data.name);
                    let arrayChannel = message.split(/[\[\]]/);
                    console.log(arrayChannel);

                    console.log(channelNames);
                    let result = [];


                    let incrementation = 0;
                    channelNames.forEach(element => {
                        console.log(element);
                        if (element.includes(arrayChannel[1])) {
                            console.log("inside");
                            result[incrementation] = element;
                            incrementation++;

                        }

                    });
                    console.log(result);
                    setListResults(result);



                });



            }

            else if (message === "/list") {
                console.log("entre dans la condition /list")
                socket.emit('GetAllChannelsInDB');
                socket.on('ResultAllChannelsInDB', (data) => {
                    let channelNames = data.map(data => data.name);
                    setListResults(channelNames);
                });

            }

            else if (message === "/users") {
                console.log("entre dans la condition /users");
                let actualRoom = (localStorage.getItem('actualRoom'));
                socket.emit('GetAllUsersInRoom', actualRoom);
                socket.on('resultAllUsers', (data) => {
                    setListResults(data);
                });


            }

            else if (message.startsWith("/nick ")) {
                console.log('entre dans la condition nick')
                let currentUser = localStorage.getItem('userName');
                let words = message.split(" ");
                let newNickname = words[1];
                socket.emit('renameUserInDB', currentUser, newNickname)
                socket.on('newNicknameResult', (newNicknameResult) => {
                    let newNickname = newNicknameResult
                    setNewNickname(newNickname);
                    localStorage.setItem('userName', newNickname);
                })
            }

            else if (message.startsWith("/create ")) {
                console.log("entre dans la condition create");
                let words = message.split(" ");
                let roomToCreate = words[1];
                socket.emit('createChannelCommand', roomToCreate, localStorage.getItem('userName'), localStorage.getItem('user_id'));
                socket.on('ResultAllChannelsSqlFor', (usercreate, allChannelsSql) => {
                    console.log(usercreate);
                    console.log(allChannelsSql);

                });
            }

            else if (message.startsWith("/delete ")) {
                console.log("entre dans la condition delete");
                let words = message.split(" ");
                let roomToDelete = words[1];
                socket.emit("deleteChannelCommand", { userName: localStorage.getItem('user_id'), room: localStorage.getItem('actualRoom'), deleteRoom: roomToDelete, people: localStorage.getItem('userName'), password: localStorage.getItem('password') });
                socket.on('updateAfterDeleteChannl', (allChannelsSql, deleteRoom) => {
                    console.log(deleteRoom);
                    console.log(allChannelsSql);
                    if (localStorage.getItem('actualRoom') == deleteRoom) {
                        localStorage.setItem('actualRoom', "");
                        changeActualRoom("");
                    }


                });


            }

            else if (message.startsWith("/msg ")) {
                console.log('entre dans la condition msg')
                let currentUser = localStorage.getItem('userName');
                let targetAndMessage = message;
                targetAndMessage = targetAndMessage.replace('/msg ', '')
                let array = targetAndMessage
                array = array.split(" ");
                let target = array[0];
                let text = targetAndMessage.replace(target + ' ', '')
                socket.emit('message', {
                    text: text,
                    channel: target,
                    name: localStorage.getItem('userName'),
                    id: `${socket.id}${Math.random()}`,
                    socketID: socket.id,
                });
            }

            else if (message.startsWith("/join ")) {
                console.log('entre dans la condition join')
                let currentUser = localStorage.getItem('userName');
                let words = message.split(" ");
                let target = words[1];
                if (localStorage.getItem('actualRoom') !== target && typeof target !== "undefined") {
                    console.log("rendre dans la condition")
                    socket.emit("join", { userName: localStorage.getItem('user_id'), room: localStorage.getItem('actualRoom'), futureRoom: target, people: localStorage.getItem('userName'), password: localStorage.getItem('password') });
                    localStorage.setItem('oldActualRoom', target);
                    changeOldActualRoom(target);

                    localStorage.setItem('actualRoom', target);
                    changeActualRoom(target);
                    console.log(localStorage.getItem('actualRoom'));
                    console.log(target);
                    localStorage.setItem('hidden', "messagePrive");
                }

            }






            else {
                socket.emit('message', {
                    text: message,
                    channel: localStorage.getItem('actualRoom'),
                    name: localStorage.getItem('userName'),
                    id: `${socket.id}${Math.random()}`,
                    socketID: socket.id,
                });



            }

        }
        setMessage('');
    };



    useEffect(() => {
        setTimeout(() => {
            setListResults([]);
        }, "5000")
    }, [listResults]);




    return (
        <div className="chat__footer w-full  border-[#EBEBEB] bg-white">
            <div>
                {listResults.length > 0 && (
                    <div className="absolute rounded-md bg-white shadow-xs flex ">
                        {listResults.map((result) => (
                            <p key={result} className="px-4 py-2">
                                {result}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            <div className='form-message flex w-full bg-white items-center'>

                <form onSubmit={handleSendMessage} className="flex w-full">
                    <input type="text" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} />
                    <div className='flex justify-center align-middle flex-col'>
                        <button className="bg-transparent font-semibold  py-2 px-4 border hover:bg-gray-100 rounded"><img src={logoSend}></img></button>
                    </div>
                </form>


            </div>


        </div>


    );
};

export default ChatFooter;