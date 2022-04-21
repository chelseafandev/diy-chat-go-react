package websocket

import "fmt"

// Register   : 새로운 클라이언트 연결이 발생한 경우에 현재 Pool내에 존재하는 모든 클라이언트에게 `New User Joined...` 메시지를 발송함
// Unregister : 사용자를 해제하고 클라이언트와의 연결이 끊어졌을때 Pool에게 노티함
// Clients    : Client의 활성화/비활성화 상태를 저장하는 맵
// Broadcast  : 메시지가 전달됐을때 Pool내에 존재하는 모든 클라이언트에게 메시지를 전송해주는 역할을 하는 채널
type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				fmt.Println(client)
				client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined..."})
			}
			break

		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected..."})
			}
			break

		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in Pool")
			for client, _ := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
