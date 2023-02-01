import React, { useState, useEffect } from 'react';
import logoPlus from './plus.png';
import { Dropdown } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';



const ChatBar = ({ socket, allChannels, allChannelsSql, changeActualRoom, actualRoom, changeOldActualRoom }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [channels, setChannels] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (event) => {
        console.log(inputValue);
        if (typeof inputValue !== "undefined" && typeof localStorage.getItem('userName') !== "undefined" && typeof localStorage.getItem('user_id') !== "undefined") {
            socket.emit('createRoom', inputValue, localStorage.getItem('userName'), localStorage.getItem('user_id'))
        }

        setIsOpen(false);

    }

    const loadChat = (e) => {
        //e.preventDefault();
        console.log("Clique pour changer de channel")
        console.log("____________ ALL CHANNELS AVANT")
        console.log(actualRoom);
        console.log(allChannels);
        console.log("____________ ALL CHANNELS SQL AVANT")
        console.log(allChannelsSql);
        const { value } = e.target.dataset;
        console.log(value);
        console.log(actualRoom);
        if (localStorage.getItem('actualRoom') !== value /*&& localStorage.getItem('actualRoom')*/ && typeof value !== "undefined") {
            console.log("rendre dans la condition")
            socket.emit("changeChannels", { userName: localStorage.getItem('user_id'), room: localStorage.getItem('actualRoom'), futureRoom: value, people: localStorage.getItem('userName'), password: localStorage.getItem('password') });
            // ancien room nouveau value
            localStorage.setItem('oldActualRoom', value);
            changeOldActualRoom(value);

            localStorage.setItem('actualRoom', value);
            changeActualRoom(value);
            console.log(localStorage.getItem('actualRoom'));
            console.log(value);
            localStorage.setItem('hidden', "messagePrive");
        }
        console.log("____________ ALL CHANNELS APRES")
        console.log(allChannels);
        console.log("____________ ALL CHANNELS SQLLLLL APRES")
        console.log(allChannelsSql);
    }
    function destroyChannel(event) {
        const buttonValue = event.target.dataset;
        console.log(buttonValue.value);
        if (typeof buttonValue.value !== "undefined") {
            socket.emit("deleteChannels", { userName: localStorage.getItem('user_id'), room: localStorage.getItem('actualRoom'), deleteRoom: buttonValue.value, people: localStorage.getItem('userName'), password: localStorage.getItem('password') });
            socket.emit('GetAllChannelsByUserSql', localStorage.getItem('userName'));
            if (localStorage.getItem('actualRoom') == buttonValue.value) {
                localStorage.setItem('actualRoom', "");
                changeActualRoom("");
            }

            console.log(localStorage.getItem('actualRoom'));

        }

    }




    useEffect(() => {

    }, [socket]);


    useEffect(() => {
        console.log(allChannelsSql)
    }, [socket]);

    return (
        <div className="chat__sidebar w-1/3 bg-white">
            <div className='w-full h-24 bg-white borderflex border-b border-[#EBEBEB] flex justify-start p-5 items-center'>
                <h2 className="pl-5 text-3xl font-bold antialiased leading-none tracking-wide mr-5 text-gray-600 md:text-3xl lg:text-3xl dark:text-white">Rooms</h2>
                <div className='mt-1'>
                    <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}
                        label={<img src={logoPlus} style={{ width: '15x', height: '15px' }} />}
                        size="lg"
                        placement="right"
                        inline={true}>
                        <Dropdown.Item>
                            <input
                                type="text"
                                minLength={3}
                                placeholder="#room"
                                name="username"
                                id="username"
                                onClick={event => event.stopPropagation()}
                                onChange={event => setInputValue(event.target.value)}
                                className="username__input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                            />
                            <div>
                                <button onClick={
                                    handleSubmit
                                } className="text-white ml-2 bg-[#8CA1CF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
            <div className=''>
                <div className='pl-10 flex flex-col mt-5 justify-evenly items-start content-around gap-y-10 h-full'>
                    {React.Children.toArray(
                        allChannels
                            .filter(channel => channel.insideRoom.some(inside => inside.user === localStorage.getItem('user_id')))
                            .map((item, index) => (
                                <div>
                                    <div className='flex'>
                                        <button class="bg-transparent w-full border-transparent text-gray-700 py-2 px-4 hover:bg-[#C9BCF1] hover:text-white rounded" value={item.nameRoom} onClick={loadChat}>
                                            <h5 subtitle size={6}>
                                                <p key={index} data-value={item.nameRoom}>{item.nameRoom}</p>
                                            </h5>
                                        </button>
                                        {
                                            localStorage.getItem('userName') === item.proprio ?
                                                <button class="bg-transparent w-full border-transparent text-gray-700 py-2 px-4 hover:bg-[#C9BCF1] hover:text-white rounded" value={item.nameRoom} onClick={destroyChannel}>
                                                    <h5 subtitle size={6}>
                                                        <p key={index} data-value={item.nameRoom}>x</p>
                                                    </h5>
                                                </button> : null
                                        }

                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
            <div className=''>
                <div className='pl-10 flex flex-col mt-5 justify-evenly items-start content-around gap-y-10 h-full'>
                    {React.Children.toArray(
                        allChannelsSql
                            .filter(channel => channel.insideRoom.some(inside => inside.user === localStorage.getItem('userName')))
                            .map((item, index) => (
                                <div>
                                    <div className='flex'>
                                        <button class="bg-transparent w-full border-transparent text-gray-700 py-2 px-4 hover:bg-[#C9BCF1] hover:text-white rounded" value={item.nameRoom} onClick={loadChat}>
                                            <h5 subtitle size={6}>
                                                {
                                                    localStorage.getItem('actualRoom') != item.nameRoom && localStorage.getItem('oldActualRoom') != item.nameRoom ?
                                                        <p key={index} data-value={item.nameRoom}>{item.nameRoom}</p>
                                                        : null
                                                }
                                            </h5>
                                        </button>
                                        {
                                            localStorage.getItem('userName') == item.proprio && localStorage.getItem('actualRoom') != item.nameRoom && localStorage.getItem('oldActualRoom') != item.nameRoom ?
                                                <button class="bg-transparent w-full border-transparent text-gray-700 py-2 px-4 hover:bg-[#C9BCF1] hover:text-white rounded" value={item.nameRoom} onClick={destroyChannel}>
                                                    <h5 subtitle size={6}>
                                                        <p key={index} data-value={item.nameRoom}>x</p>
                                                    </h5>
                                                </button> : null
                                        }
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBar;
