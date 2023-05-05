import { useState } from "react";
import CodeDisplay from "./components/CodeDisplay";
import MessagesDisplay from "./components/MessagesDisplay";

interface ChatData {
  role: string,
  content: string,
}

const App = () => {
  const [value, setValue] = useState("")
  const [chat, setChat] = useState<ChatData[]>([])

  const getQuery = async () => {
    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          message: value,
        }),
      };

      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      console.log(data);      

      const userMessage = {
        role: "user",
        content: value
      }

      setChat(oldChat => [...oldChat, data, userMessage])
    } catch (error) {
      console.error(error);
    }
  };

  const clearChat = () => {
    setValue("");
    setChat([]);
  }

  const filteredUsersMessages = chat.filter(message => message.role === "user");

  const latestCode = chat.filter(message => message.role === "assistant").pop();

  return (
    <div className="app">
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="What do you want to do with SQL?"/>
      <div className="button-container">
        <button id="get-query" onClick={getQuery}>
          Get Query!
        </button>
        <button id="clear-chat" onClick={clearChat}>Clear Chat</button>
      </div>
      <CodeDisplay text={latestCode?.content || ""}/>
      <MessagesDisplay userMessages={filteredUsersMessages}/>
    </div>
  );
};

export default App;
