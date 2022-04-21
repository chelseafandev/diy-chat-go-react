var socket = new WebSocket("ws://localhost:8080/ws");

let connect = cb => {
    console.log("connecting");

    socket.onopen = () => {
        console.log("[onopen] Successfully Connected");
    };

    socket.onmessage = msg => {
        console.log("[onmessage] Received Message: ", msg.data);
        cb(msg);
    };

    socket.onclose = event => {
        console.log("[onclose] Socket Closed Connection: ", event);
    };

    socket.onerror = error => {
        console.log("[onerror] Socket Error: ", error);
    };
};

let sendMsg = msg => {
    console.log("sending msg: ", msg);
    socket.send(msg);
};

export { connect, sendMsg };