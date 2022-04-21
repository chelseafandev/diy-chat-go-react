package websocket

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

// ID   : 특정 세션을 구분할 수 있는 유니크한 문자열
// Conn : websocket.Conn 객체를 가리키는 포인터
// Pool : 현재 클라이언트가 속하게 될 Pool을 가리키는 포인터
type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		message := Message{Type: messageType, Body: string(p)}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
