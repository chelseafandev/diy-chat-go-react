import React, { useState, useEffect } from "react";
import queryString from "query-string";
import InfoBar from "../Infobar/Infobar";
import Input from "../Input/Input";
import "./Chat.css";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer"

let socket;

function Chat({ location }) {
    // re-rendering을 위한 효과적인 방법은? useState!
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    // useEffect 안에서 사용하는 상태나, props 가 있다면, useEffect 의 deps 에 넣어주어야 합니다. 그렇게 하는게, 규칙입니다.
    // 만약 useEffect 안에서 사용하는 상태나 props 를 deps 에 넣지 않게 된다면 useEffect 에 등록한 함수가 실행 될 때,
    // 최신 props/상태를 가르키지 않게 됩니다.
    //
    // deps에 location.search를 추가했다는 의미 = location.search 값이 변경될때만 아래 내용을 실행하겠다는 의미
    useEffect(() => {
        // 컴포넌트가 화면에서 나타남
        socket = new WebSocket("ws://localhost:8080/ws");
        console.log("socket create...");
        
        const { name, room } = queryString.parse(location.search);    
        setRoom(room);
        setName(name);
        console.log("room: %s, name: %s", room, name);
        
        socket.onopen = function(event) {
            console.log("[onopen] successfully connected...");
            socket.send(
                JSON.stringify({
                    type: "join",
                    room: room,
                    user: name,
                    text: "join",
                })
            );
        };
        
        // 컴포넌트가 파괴될 때 호출될 함수(cleanup function)
        return () => {
            socket.close(1000, "socket close...");
            console.log("socket close...");
        };
    }, [location.search]);

    useEffect(() => {
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log("[onmessage] received message...");
            
            switch (data.type) {
                case "message":
                    setMessages((messages) => [...messages, data]);
                    break;
                case "register":
                    setMessages((messages) => [...messages, data]);
                    console.log(data.users)
                    setUsers("");
                    for (let i = 0; i < Object.keys(data.users).length; i++) {
                        setUsers((users) => [...users, data.users[i]]);
                    }
                    
                    break;
                case "unregister":
                    setMessages((messages) => [...messages, data]);
                    console.log(data.users)
                    setUsers("");
                    for (let i = 0; i < Object.keys(data.users).length; i++) {
                        setUsers((users) => [...users, data.users[i]]);
                    }
                    break;
                default:
                    break;
            }
        };
    }, [users, messages]);

    function sendMessage(event) {
        event.preventDefault();
        if (message) {
            socket.send(message);
            setMessage("");
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input
                    message={message}
                    sendMessage={sendMessage}
                    setMessage={setMessage}
                ></Input>
            </div>
            <TextContainer users = {users} />
        </div>
    );
}

export default Chat;
