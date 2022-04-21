import React, { Component } from "react";
import "./ChatHistory.scss";
import Message from "../Message/Message";

// 클래스 컴포넌트
// 참고: https://reactjs.org/docs/components-and-props.html#function-and-class-components
// 
// ChatHistory 컴포넌트는 `App.js` 함수의 `props`를 통해 채팅 메시지들의 배열을 저장하고 그 이후에 그 메시지들을 렌더링함
class ChatHistory extends Component {
    render() {
        // map 메소드를 사용해서 (반복문 없이)array 객체에 담긴 모든 값을 렌더링함
        console.log(this.props.history);
        const messages = this.props.history.map(msg => <Message message={msg.data} />);

        return (
            <div className="ChatHistory">
                <h2>Chat History</h2>
                {messages}
            </div>
        );
    }
}

export default ChatHistory;