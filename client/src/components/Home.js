import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';


$('#notification').hide();

const Home = ({ socket }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [room, setRoom] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('userName', userName);
        localStorage.setItem('password', password);
        localStorage.setItem('oldActualRoom', "");
        localStorage.setItem('hidden', "messagePrive");
        if ((document.getElementById('room').value === "") || (document.getElementById('room').value === undefined)
            || (document.getElementById('room').value === null)) {
            localStorage.setItem('actualRoom', "#general");

        } else {
            localStorage.setItem('actualRoom', document.getElementById('room').value);
        }

        socket.emit('Login', { userName, password, socketID: socket.id, room: localStorage.getItem('actualRoom') }, (response) => {




            if ((response.status === "OK") && (!verification() === false)) {


                if ((document.getElementById('room').value === "") || (document.getElementById('room').value === undefined) || (document.getElementById('room').value === null)) {
                    console.log("empty");
                    socket.emit('create', "#general", localStorage.getItem('userName'));
                    socket.emit('loadContent', "#general");



                } else {
                    socket.emit('create', document.getElementById('room').value, localStorage.getItem('userName'));
                    socket.emit('loadContent', document.getElementById('room').value);

                }

                socket.emit('GetAllChannelsByUserSql', localStorage.getItem('userName'));

                navigate('/chat');




            } else {

                $("#notification").animate({ "opacity": "show", top: "100" }, 500);

                setTimeout(function () {
                    $('#notification').fadeOut('fast');
                }, 10000);

            }
        });

    };



    const NavigateSignUp = () => {
        navigate('/signup');
    }

    function verification() {
        const roomInput = document.getElementById('room');
        const hashtag = '#';

        console.log(roomInput.value);
        if ((roomInput.value === "") || (roomInput.value === undefined) || (roomInput.value === null)) {
            console.log("empty");

            return true;
        }
        else if (!roomInput.value.includes(hashtag)) {
            console.log("doesn't contain hashtag");
            return false;
        }
        else
            return true;
    }


    return (
        <div className="flex h-full w-full justify-center align-middle">
            <div className='flex flex-col justify-center'>

            </div>
            <div className='flex flex-col justify-center'>
                <div className="p-4 mt-40 text-sm w-96 text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 absolute" role="alert" id='notification'>
                    <span className="sr-only">Info</span>
                    <div>
                        <span class="font-medium">Login failed!</span> Check your credentials.
                    </div>
                </div>
                <div className="max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 w-96">

                    <div className='flex justify-center m-6'>

                        <svg xmlns="http://www.w3.org/2000/svg" width="70" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="100" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="a8bb2d086e"><path d="M 15.703125 278 L 263 278 L 263 341 L 15.703125 341 Z M 15.703125 278 " clipRule="nonzero" /></clipPath><clipPath id="a22991f81e"><path d="M 202 119 L 359.203125 119 L 359.203125 366.65625 L 202 366.65625 Z M 202 119 " clipRule="nonzero" /></clipPath><clipPath id="a4c5614e46"><path d="M 78 8.15625 L 247 8.15625 L 247 269 L 78 269 Z M 78 8.15625 " clipRule="nonzero" /></clipPath></defs><g clipPath="url(#a8bb2d086e)"><path fill="#8ca1cf" d="M 46.78125 278.964844 L 232.816406 278.964844 L 262.273438 340.703125 L 15.777344 340.703125 L 46.78125 278.964844 " fillOpacity="1" fillRule="evenodd" /></g><g clipPath="url(#a22991f81e)"><path fill="#9875ab" d="M 335.136719 314.042969 L 359.167969 366.660156 L 286.304688 366.660156 L 202.589844 190.566406 L 239.019531 119 L 335.136719 314.042969 " fillOpacity="1" fillRule="evenodd" /></g><g clipPath="url(#a4c5614e46)"><path fill="#6acfd4" d="M 164.605469 242.484375 L 152.203125 268.4375 L 78.5625 268.4375 L 211.117188 8.152344 L 246.773438 81.117188 L 164.605469 242.484375 " fillOpacity="1" fillRule="evenodd" /></g></svg>                </div>
                    <div className='flex justify-center m-6'><h2 className="text-2xl font-bold antialiased leading-none tracking-tight text-gray-600 md:text-2xl lg:text-2xl dark:text-white">Log in to your account</h2></div>

                    <form>
                        <div className="grid gap-4">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <input
                                    type="text"
                                    minLength={3}
                                    placeholder="Enter your super cool username"
                                    name="username"
                                    id="username"
                                    className="username__input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    minLength={6}
                                    name="password"
                                    id="password"
                                    placeholder='And a super safe password'
                                    className="password__input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="room" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room</label>
                                <input
                                    type="text"
                                    name="room"
                                    id="room"
                                    placeholder='#general'
                                    className="room__input  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    required
                                />
                                <p className="mt-2 text-xs">If left blank, you will join the general channel by default.</p>
                            </div>
                            <div className='button-div flex justify-center'>
                                <button type="submit" onClick={handleSubmit} className="button-home text-white bg-[#8CA1CF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                            </div>
                            <div className='flex justify-center'>
                                <p className="mt-2 text-xs cursor-default">Don't have an account? <a className='font-medium text-[#6ACFD4] dark:text-[#6ACFD4] hover:underline cursor-pointer' onClick={NavigateSignUp}>Sign In</a></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

};

export default Home;