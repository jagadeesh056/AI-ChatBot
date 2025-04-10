import { useEffect, useRef, useState } from 'react'
import ChatbotIcon from './components/ChatbotIcon'
import Chatform from './components/Chatform'
import ChatMessage from './components/ChatMessage'

import './App.css'

function App() {
  const [chatHistory, setChatHistory] = useState([])
  const [showChatbot, setShowchatbot] = useState(false)
  const chatBodyRef = useRef()

  const generateResponses = async history => {
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text, isError}])
    }

    history = history.map(({role, text}) => ({role, parts: [{text}]}))

    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({contents: history})
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_KEY, requestOptions)
      const data = await response.json()
      if(!response.ok) throw new Error(data.error.message || "Something went wrong")
        console.log(data)
      const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
      updateHistory(apiResponse)
    } catch (error) {
      console.log(error)
      updateHistory(error.message, true)
    }
  }

  useEffect(() => {
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behaviour: "smooth" })
  }, [chatHistory])

  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ""}`}>
      <div>
        <p className={`${showChatbot ? "none" : "para"}`}>Click me to chat</p>
        <button onClick={() => setShowchatbot(prev => !prev)} id="chatbot-toggler">
          <span className='material-symbols-rounded'>mode_comment</span>
          <span className='material-symbols-rounded'>close</span>
        </button>
      </div>
      <div className="chatbot-popup">
        {/*chatbot-header */}
        <div className="chatbot-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className='logo-text'>Chatbot</h2>
          </div>
          <button 
            className='material-symbols-rounded'
            onClick={() => setShowchatbot(prev => !prev)}
          >
            keyboard_arrow_down
          </button>
        </div>
        {/*chatbot-body*/}
        <div ref={chatBodyRef} className="chatbot-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there<br />How can i help you?
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        <div className="chat-footer">
          <Chatform
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateResponses={generateResponses}
          />
        </div>
      </div>
    </div>
  )
}

export default App
