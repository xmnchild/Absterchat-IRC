import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


const ChatBar = ({ socket, allChannels, actualRoom, newNickname, changeActualRoom, changeOldActualRoom }) => {
    const [users, setUsers] = useState([]);

    function contactUser(event) {
        console.log(event.target.value)
        const buttonValue = event.target.value;
        console.log("------------------------------------contactUser est appellé")
        console.log(buttonValue);
        if (typeof buttonValue !== "undefined") {
            console.log("------------------------------------nest pas undefined")
            console.log(localStorage.getItem('ActualRoom'))
            localStorage.setItem('oldActualRoom', actualRoom);
            changeOldActualRoom(localStorage.getItem('ActualRoom'));

            localStorage.setItem('actualRoom', buttonValue);
            changeActualRoom(buttonValue);
            localStorage.setItem('hidden', "message");


        }

    }


    socket.on('newUserResponse', (data) => setUsers(data));


    useEffect(() => {
        socket.on('newUserResponse', (data) => setUsers(data));
        localStorage.getItem('actualRoom')
        users.map((people) => (
            allChannels.map((item, index) => {
                console.log(item.nameRoom)
                if (localStorage.getItem('actualRoom') == item.nameRoom) {
                    item.insideRoom.map((element, index) => {
                        if (element.user == people.socketID) {
                            console.log("<p key={index}>{element.user}</p>")
                        }
                    })
                }
            })
        ))
        socket.on('newUserResponse', (data) => setUsers(data));
    }, [socket]);

    useEffect(() => {
        console.log(users);

    }, [users]);



    return (
        <div className="chat__sidebar border-l border-[#EBEBEB] mr-4 h-full p-5 bg-white">
            <div className='w-full h-24 bg-white p-5 flex justify-center align-middle'>
                <h2 className="text-3xl font-bold antialiased leading-none tracking-wide text-gray-600 md:text-3xl lg:text-3xl dark:text-white">Users active</h2>
            </div>

            <div className="chat__users">


                {React.Children.toArray(
                    users
                        .filter(user => actualRoom === user.room)
                        .map((user) => (
                            <div >
                                <div >
                                    <h5 subtitle size={6}>
                                        <p key={user.socketID}>{user.userName}</p>
                                    </h5>
                                </div>
                            </div>


                        ))
                )}
            </div>



            <div className='w-full h-24 bg-white p-5 flex justify-center align-middle'>
                <h2 className="text-3xl font-bold antialiased leading-none tracking-wide text-gray-600 md:text-3xl lg:text-3xl dark:text-white">All Users</h2>
            </div>

            <div className="chat__users">
                {React.Children.toArray(
                    users
                        .filter(user => localStorage.getItem('userName') !== user.userName)
                        .map((user) => (
                            <div>
                                <button class="bg-transparent w-full border-transparent text-gray-700 py-2 px-4 hover:bg-[#C9BCF1] hover:text-white rounded" value={user.userName} onClick={contactUser}>
                                    {user.userName}
                                </button>
                            </div>
                        ))
                )}

            </div>
        </div>
    );
};

export default ChatBar;