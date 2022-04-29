package websocket

import (
	"fmt"
	"bytes"
)

// Register   : 새로운 클라이언트 연결이 발생한 경우에 현재 Pool내에 존재하는 모든 클라이언트에게 `New User Joined...` 메시지를 발송함
// Unregister : 사용자를 해제하고 클라이언트와의 연결이 끊어졌을때 Pool에게 노티함

// Broadcast  : 메시지가 전달됐을때 Pool내에 존재하는 모든 클라이언트에게 메시지를 전송해주는 역할을 하는 채널
type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Rooms      map[string]map[string]*Client
	Broadcast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Rooms:      make(map[string]map[string]*Client),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			if len(pool.Rooms[client.Room]) == 0 {
				pool.Rooms[client.Room] = make(map[string]*Client)
			}

			pool.Rooms[client.Room][client.ID] = client

			for _, member := range pool.Rooms[client.Room] {
				var tmpText bytes.Buffer
				tmpText.WriteString("`")
				tmpText.WriteString(client.ID)
				tmpText.WriteString("` joined...")
				member.Conn.WriteJSON(Message{Type: "register", Room:client.Room, User: "admin", Text: tmpText.String()})
			}
			break

		case client := <-pool.Unregister:
			// delete client
			delete(pool.Rooms[client.Room], client.ID)
			fmt.Printf("delete `%s` in `%s` room (remain: %d)\n", client.ID, client.Room, len(pool.Rooms[client.Room]))

			// delete chatroom
			if len(pool.Rooms[client.Room]) == 0 {
				delete(pool.Rooms, client.Room)
				fmt.Printf("`%s` room is empty. delete this room\n", client.Room)
			}
			
			for _, member := range pool.Rooms[client.Room] {
				var tmpText bytes.Buffer
				tmpText.WriteString("`")
				tmpText.WriteString(client.ID)
				tmpText.WriteString("` out...")
				member.Conn.WriteJSON(Message{Type: "unregister", User: "admin", Text: tmpText.String()})
			}
			break

		case message := <-pool.Broadcast:
			fmt.Printf("Sending message to all clients in `%s` room\n", message.Room)
			for _, client := range pool.Rooms[message.Room] {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
			break
		}
	}
}
