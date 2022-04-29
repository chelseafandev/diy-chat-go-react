package websocket

import (
	"fmt"
	"log"
	"bytes"
	"encoding/json"

	"github.com/gorilla/websocket"
)

// ID   : 클라이언트 아이디
// Conn : websocket.Conn 객체를 가리키는 포인터
// Pool : 현재 클라이언트가 속하게 될 Pool을 가리키는 포인터
type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
	Room string
}

type Message struct {
	Type string `json:"type"`
	Room string `json:"room"`
	User string `json:"user"`
	Text string `json:"text"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		var message Message

		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		var msg = Message{}
		err2 := json.Unmarshal([]byte(string(p)), &msg)
		if err2 != nil {
			fmt.Println("Failed to json.Unmarshal")
			message = Message{Type: "message", Room: c.Room, User: c.ID, Text: string(p)}
		} else {
			if msg.Type == "join" {
				// set id & room of client
				c.ID = msg.User
				c.Room = msg.Room

				// add client to chatroom
				c.Pool.Register <- c

				// make join message
				var tmpText bytes.Buffer
				tmpText.WriteString("`")
				tmpText.WriteString(c.ID)
				tmpText.WriteString("` joined...")
			}
		}
		
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
