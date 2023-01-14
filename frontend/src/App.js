import './App.css';
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Homepage";
import ChatPage from "./Pages/Chatpage";

function App() {
  return (
    <div className="App texture4">
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/chats" element={<ChatPage />}></Route>
      </Routes>

    </div>
  );
}

export default App;
