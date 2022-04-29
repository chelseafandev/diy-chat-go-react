package main

import (
	"fmt"
	"net/http"

	"github.com/chelseafandev/diy-chat-go-react/pkg/websocket"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")

	// 현재 http connection을 websocket connection으로 업그레이드해주는 작업(`gorilla/websocket` 패키지에서 제공해주고있음)
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	client.Read()
}

func setupRoutes() {
	// Pool: 세션 정보를 관리하는 객체
	pool := websocket.NewPool()
	go pool.Start()

	// `/ws`는 `http` 요청을 `ws`로 변환해주는 endpoint 이다
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
}

func main() {
	fmt.Println("Distributed Chat App v0.01")
	setupRoutes()
	http.ListenAndServe(":8080", nil)
}
