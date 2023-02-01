import './App.css';
import socketIO from 'socket.io-client';
import ChatPage from './components/ChatPage';
import SignUpPage from './components/SignUp.js';

import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const socket = socketIO.connect('http://localhost:4000');

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
          <Route path="/signup" element={<SignUpPage socket={socket} />}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
