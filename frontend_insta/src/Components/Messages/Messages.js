import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Messages.css"
import Message from "./Message/Message"

// props 는 부모 컴포넌트로부터 자식 컴포넌트에 데이터를 보낼 수 있게 해주는 방법
// props 자체를 인자로 넘길 수 있지만 property 변수(여기서는 messages와 name)를 직접 입력해서 넘겨주는게 일반적임
function Messages({ messages,name }) {
  return (
    <ScrollToBottom className = "messages">
      {messages.map((message, i) => 
        <div key={i}>
          <Message message={message} name={name}></Message>
        </div>
      )}
    </ScrollToBottom>
  );
}

export default Messages;
