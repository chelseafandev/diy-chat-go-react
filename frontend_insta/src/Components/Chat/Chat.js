import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from "../Infobar/Infobar";
import Input from "../Input/Input";
import "./Chat.css";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer"

let socket;

function Chat({ location }) {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    // useEffect 안에서 사용하는 상태나, props 가 있다면, useEffect 의 deps 에 넣어주어야 합니다. 그렇게 하는게, 규칙입니다.
    // 만약 useEffect 안에서 사용하는 상태나 props 를 deps 에 넣지 않게 된다면 useEffect 에 등록한 함수가 실행 될 때,
    // 최신 props/상태를 가르키지 않게 됩니다.
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
                    user: name,
                    text: room,
                })
            );
        };

        // 컴포넌트가 화면에서 사라짐
        return () => {
            socket.close(1000, "socket close...");
            console.log("socket close...");
        };
    }, [location.search]);

    useEffect(() => {
        socket.onmessage = function(event) {
            const { name, room } = queryString.parse(location.search);

            const data = JSON.parse(event.data);
            console.log("[onmessage] received message...");
            
            switch (data.type) {
                case "message":
                    setMessages((messages) => [...messages, data]);
                    break;
                case "admin":
                    setMessages((messages) => [...messages, data]);
                    break;
                default:
                    
                    break;
            }

            
        };
    }, [messages, location.search]);

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
