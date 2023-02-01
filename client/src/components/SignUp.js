import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SignUp = ({ socket }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    function displayPasswordError() {
        var errorpassword = document.getElementById('password');
        var errorpasswordconf = document.getElementById('confirm-password');
        var helper = document.createElement('p');
        helper.innerHTML = "Passwords don't match.";
        helper.classList.add('mt-2');
        helper.classList.add('text-xs');
        helper.classList.add('text-red-500');
        errorpassword.classList.add('border-red-500');
        errorpasswordconf.classList.add('border-red-500');

        errorpasswordconf.after(helper);

        if ((errorpassword.onClick()) || (errorpassword.onClick())) {
            helper.remove();
            errorpassword.classList.remove('border-red-500');
            errorpasswordconf.classList.remove('border-red-500');
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === passwordConfirm) {
            localStorage.setItem('userName', userName);
            localStorage.setItem('password', password);
            socket.emit('newUser', { userName, password, socketID: socket.id }, (response) => {
                if ((response.status === "OK")) {
                    navigate('/');
                }

                else {
                    alert("USERNAME ALREADY EXISTS");
                }
            })

        }

        else {

            displayPasswordError();
            console.log('good');

        }

    };

    const NavigateSignIn = () => {
        navigate('/');

    }

    return (
        <div className="flex h-full w-full justify-center align-middle">
            <div className='flex flex-col justify-center'>
                <div className="max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 w-96">
                    <div className='flex justify-center m-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" zoomAndPan="magnify"
                            viewBox="0 0 375 374.999991" height="100" preserveAspectRatio="xMidYMid meet" version="1.0"><defs>
                                <clipPath id="a8bb2d086e"><path d="M 15.703125 278 L 263 278 L 263 341 L 15.703125 341 Z M 15.703125 278 " clipRule="nonzero" /></clipPath>
                                <clipPath id="a22991f81e"><path d="M 202 119 L 359.203125 119 L 359.203125 366.65625 L 202 366.65625 Z M 202 119 " clipRule="nonzero" /></clipPath>
                                <clipPath id="a4c5614e46"><path d="M 78 8.15625 L 247 8.15625 L 247 269 L 78 269 Z M 78 8.15625 " clipRule="nonzero" /></clipPath>
                            </defs><g clipPath="url(#a8bb2d086e)"><path fill="#8ca1cf" d="M 46.78125 278.964844 L 232.816406 278.964844 L 262.273438 340.703125 L 15.777344 340.703125 L 46.78125 278.964844 " fillOpacity="1" fillRule="evenodd" />
                            </g><g clipPath="url(#a22991f81e)"><path fill="#9875ab" d="M 335.136719 314.042969 L 359.167969 366.660156 L 286.304688 366.660156 L 202.589844 190.566406 L 239.019531 119 L 335.136719 314.042969 " fillOpacity="1" fillRule="evenodd" /></g><g clipPath="url(#a4c5614e46)"><path fill="#6acfd4" d="M 164.605469 242.484375 L 152.203125 268.4375 L 78.5625 268.4375 L 211.117188 8.152344 L 246.773438 81.117188 L 164.605469 242.484375 " fillOpacity="1" fillRule="evenodd" /></g></svg>
                    </div>
                    <div className='flex justify-center m-6'><h2 className="text-2xl font-bold antialiased leading-none tracking-tight text-gray-600 md:text-2xl lg:text-2xl dark:text-white">Create an account</h2>
                    </div>
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
                                <label htmlFor="password" className="password block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input
                                    type="password"
                                    minLength={6}
                                    name="password"
                                    id="password"
                                    placeholder='And a super safe password'
                                    className="password password__input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm_password" className="password block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                <input
                                    type="password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    placeholder='Confirm your password'
                                    className="password password__input  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required
                                />
                                <div className='m-2'>
                                </div>
                            </div>
                            <div className='button-div flex justify-center'>
                                <button type="submit" onClick={handleSubmit} className=" button-signup text-white bg-[#8CA1CF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                            </div>
                            <div className='flex justify-center'>
                                <p className="mt-2 text-xs cursor-default">Already have an account? <a className='font-medium text-[#6ACFD4] dark:text-[#6ACFD4] hover:underline cursor-pointer	' onClick={NavigateSignIn}>Log In</a></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;