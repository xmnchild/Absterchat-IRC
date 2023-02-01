import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoExit from './exit.png';

const ChatBody = ({ messages, messagesPrive, lastMessageRef, socket, changeActualRoom, changeOldActualRoom }) => {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const handleLeaveChat = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('actualRoom');
        navigate('/');
        window.location.reload();
    };

    const handleSubmit = (event) => {
        console.log(inputValue);
        if (typeof inputValue !== "undefined" && typeof localStorage.getItem('userName') !== "undefined" && typeof localStorage.getItem('user_id') !== "undefined" && localStorage.getItem('actualRoom') !== "undefined") {
            socket.emit('changeNameRoom', inputValue, localStorage.getItem('userName'), localStorage.getItem('user_id'), localStorage.getItem('actualRoom'), (response) => {
                if (response.status != "fail") {
                    localStorage.setItem('actualRoom', inputValue);
                    changeActualRoom(inputValue);
                    localStorage.setItem('oldActualRoom', inputValue);
                    changeOldActualRoom(inputValue);
                }
            })

        }


        setIsOpen(false);

    }


    return (
        <div className='w-full border-l bg-white border-[#EBEBEB] '>
            <div className='w-full h-20 bg-white borderflex border-b border-[#EBEBEB] flex justify-between p-5 items-center'>
                <h2 className="pl-5 text-3xl font-bold antialiased leading-none tracking-wide mr-5 text-gray-600 md:text-3xl lg:text-3xl dark:text-white">
                    {localStorage.getItem('actualRoom')}
                </h2>
                <input
                    type="text"
                    minLength={3}
                    placeholder={localStorage.getItem('actualRoom')}
                    name="username"
                    id="username"
                    onClick={event => event.stopPropagation()}
                    onChange={event => setInputValue(event.target.value)}
                    className="username__input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                />
                <div>
                    <button onClick={handleSubmit} className="text-white ml-2 bg-[#8CA1CF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Change</button>
                </div>


                <p></p>
                <div className='mt-1'>

                </div>
                <button className="bg-transparent font-semibold border hover:bg-gray-100 rounded py-2 px-4" onClick={handleLeaveChat}>
                    <img src={logoExit} />
                </button>

            </div>

            {
                localStorage.getItem('hidden') !== "message" ?
                    <div className="message__div overflow-auto ">
                        {localStorage.getItem('actualRoom') !== "" && messages.map((message) =>
                            message.name === localStorage.getItem('userName') && message.channel == localStorage.getItem('actualRoom') ? (
                                <div className="message__chats" key={message.id}>
                                    <p className="sender__name">You</p>
                                    <div className="message__sender">
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            ) : (
                                message.channel == localStorage.getItem('actualRoom') ? (
                                    <div className="message__chats" key={message.id}>
                                        <p>{message.name}</p>
                                        <div className="message__recipient">
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                ) : null
                            )
                        )}
                        <div ref={lastMessageRef} />
                    </div>
                    : null
            }
            {
                localStorage.getItem('hidden') !== "messagePrive" ?
                    <div className="message__div scrollbar">
                        {localStorage.getItem('actualRoom') !== "" && messagesPrive.map((messagePrive) =>
                            messagePrive.name === localStorage.getItem('userName') && messagePrive.two.includes(localStorage.getItem('actualRoom')) &&
                                messagePrive.two.includes(localStorage.getItem('userName')) ? (
                                <div className="message__chats" key={messagePrive.id}>
                                    <p className="sender__name">You</p>
                                    <div className="message__sender">
                                        <p>{messagePrive.text}</p>
                                    </div>
                                </div>
                            ) : (
                                messagePrive.two.includes(localStorage.getItem('actualRoom')) &&
                                    messagePrive.two.includes(localStorage.getItem('userName'))
                                    ? (
                                        <div className="message__chats" key={messagePrive.id}>
                                            <p>{messagePrive.name}</p>
                                            <div className="message__recipient">
                                                <p>{messagePrive.text}</p>
                                            </div>
                                        </div>
                                    ) : null
                            )
                        )}
                        <div ref={lastMessageRef} />
                    </div>



                    : null
            }





        </div>
    );
};

export default ChatBody;