import React, { Component } from "react";
import { connect, sendMsg } from './api';
import './App.css';
import Header from './components/Header/Header';
import ChatHistory from "./components/ChatHistory/ChatHistory";
import ChatInput from "./components/ChatInput/ChatInput";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatHistory: []
    }
  }

  componentDidMount() {
    // connect 함수의 인자로 callback 함수를 바로 정의함(lambda 생각하면될듯)
    connect((msg) => {
      console.log("Start Callback Function")
      this.setState(prevState => ({
        // ...은 spread 연산자
        // chatHistory array에 값을 채우는 과정으로 생각하면됨
        chatHistory: [...this.state.chatHistory, msg]
      }))
      console.log("Add ", msg.data, " to `chatHistory` array");
    });
  }

  send(event) {
    if (event.keyCode === 13) {
      sendMsg(event.target.value);
      event.target.value = "";
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <ChatHistory history={this.state.chatHistory} />
        <ChatInput send={this.send} />
      </div>
    );
  }
}

export default App;