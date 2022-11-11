import './App.css';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Exact keyword to show that path should be exactly /. */}
        <Route path='/' element={<Homepage/>} exact/>
      </Routes>
       <Routes>
        <Route path='/chats' element={<ChatPage/>} />
      </Routes>
    </div>
  );
}

export default App;
