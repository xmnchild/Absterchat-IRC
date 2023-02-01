import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthAmerica, faComments } from '@fortawesome/free-solid-svg-icons';
import logoGlobe from './globe.png';
import logoMessages from './envelope.png';
import logoSettings from './setting-lines.png';



const ChatLeftSideBar = ({ socket }) => {
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState(['item1', 'item2']);
    useEffect(() => {
        socket.on('newUserResponse', (data) => setUsers(data));



    }, [socket, users]);


    return (
        <div className='h-screen w-20 bg-white ml-4 p-4 shadow-lg flex flex-col justify-between z-10'>
            <div className='icons flex flex-col justify-center align-middle items-center gap-12'>
                <div className='flex justify-center m-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" zoomAndPan="magnify"
                        viewBox="0 0 375 374.999991" height="40" preserveAspectRatio="xMidYMid meet" version="1.0"><defs>
                            <clipPath id="a8bb2d086e"><path d="M 15.703125 278 L 263 278 L 263 341 L 15.703125 341 Z M 15.703125 278 " clipRule="nonzero" /></clipPath>
                            <clipPath id="a22991f81e"><path d="M 202 119 L 359.203125 119 L 359.203125 366.65625 L 202 366.65625 Z M 202 119 " clipRule="nonzero" /></clipPath>
                            <clipPath id="a4c5614e46"><path d="M 78 8.15625 L 247 8.15625 L 247 269 L 78 269 Z M 78 8.15625 " clipRule="nonzero" /></clipPath>
                        </defs><g clipPath="url(#a8bb2d086e)"><path fill="#8ca1cf" d="M 46.78125 278.964844 L 232.816406 278.964844 L 262.273438 340.703125 L 15.777344 340.703125 L 46.78125 278.964844 " fillOpacity="1" fillRule="evenodd" />
                        </g><g clipPath="url(#a22991f81e)"><path fill="#9875ab" d="M 335.136719 314.042969 L 359.167969 366.660156 L 286.304688 366.660156 L 202.589844 190.566406 L 239.019531 119 L 335.136719 314.042969 " fillOpacity="1" fillRule="evenodd" /></g><g clipPath="url(#a4c5614e46)"><path fill="#6acfd4" d="M 164.605469 242.484375 L 152.203125 268.4375 L 78.5625 268.4375 L 211.117188 8.152344 L 246.773438 81.117188 L 164.605469 242.484375 " fillOpacity="1" fillRule="evenodd" /></g></svg>
                </div>


            </div>
            <div className='flex h-fit justify-center m-2'>

                <div className='flex items-center'>
                    <div><img src={logoSettings} /></div>
                </div>
            </div>
        </div>
    );
};

export default ChatLeftSideBar;