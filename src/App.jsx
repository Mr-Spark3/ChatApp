import { useEffect, useState } from "react";
import { socket } from "./socket";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    function onNewChat(msg) {
      console.log(msg);
      setMessages((msgs) => [...msgs, msg]);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newChat", onNewChat);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newChat", onNewChat);
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const messageObj = { msg: newMessage, id: username };
    setMessages((msgs) => [...msgs, messageObj]);
    socket.emit("newMsg", messageObj);
    setNewMessage("");
  }
  function handleChange(e) {
    setNewMessage(e.target.value);
  }

  return (
    <div className="App">
      <span>username</span><input onChange={(e) => setUsername(e.target.value)} value={username} type="text" />
      <h1>Chat App</h1>
      {isConnected ? <p>Connected</p> : <p>Disconnected</p>}
      <div className="chat-window">
        {messages.length
          ? messages.map((info, idx) => (
              <p key={info.id + idx}>
                <span>{info.id}: &nbsp; | &nbsp; </span>
                {info.msg}
              </p>
            ))
          : "no one is talking"}
      </div>
      <form onSubmit={handleSubmit} className="new-message-wrapper">
        <input
          onChange={handleChange}
          name="newMessage"
          type="text"
          value={newMessage}
        />
        <button type="submit">send</button>
      </form>
    </div>
  );
}

export default App;