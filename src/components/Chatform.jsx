import React, {useRef} from 'react'

const Chatform = ({chatHistory, setChatHistory, generateResponses}) => {
  const inputRef = useRef()
  const onSubmitForm =(e) =>{
    e.preventDefault()
    const userMsg = inputRef.current.value.trim()
    if(!userMsg) return
    inputRef.current.value=""
    console.log(userMsg)
    setChatHistory(history => [...history, {role: "user", text: userMsg}])
    setTimeout(() => {
      setChatHistory(history => [...history, {role: "model", text: "Thinking..."}])
      generateResponses([...chatHistory, {role: "user", text: userMsg}])
    }, 600)
  }
  return (
    <form action="#" className="chat-form" onSubmit={onSubmitForm}>
        <input
          type="text"
          ref={inputRef}
          className="message-input"
          placeholder='Message...'
          required
        />
        <button className='material-symbols-rounded'>arrow_upward</button>
  </form>
  )
}

export default Chatform