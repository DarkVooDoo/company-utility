package main

import (
	"log"
	"net/http"
	"strconv"
	"time"
	"work/route"
)

const (
	PORT = "5000"
)

var Routes map[string]func(http.ResponseWriter, *http.Request) = map[string]func(http.ResponseWriter, *http.Request){
	"/api/user":    route.UserRoute,
	"/api/pro":     route.ProRoute,
	"/api/member":  route.MemberRoute,
	"/api/auth":    route.AuthRoute,
	"/api/shift":   route.ShiftRoute,
	"/api/notif":   route.NotificationRoute,
	"/api/holyday": route.HolydayRoute,
	"/api/search":  route.SearchRoute,
	"/api/tracker": route.TrackerRoute,
	"/api/job":     route.NewJobRoute,
	"/api/payroll": route.PayrollRoute,
	"/ws":          route.WebsocketRoute,
}

func main() {
	mux := http.NewServeMux()
	for route, funcHandler := range Routes {
		mux.HandleFunc(route, funcHandler)
	}
	s := &http.Server{
		Addr:        ":5000",
		Handler:     mux,
		IdleTimeout: time.Second * 10,
	}
	go cronJob("0", "0", "*", "*", "*")
	if err := s.ListenAndServe(); err != nil {
		log.Fatal("server crash")
	}
}

func cronJob(minute string, hour string, monthDay string, month string, weekDay string) {
	for {
		time.Sleep(time.Minute * 1)
		date := time.Now()
		if weekDay == strconv.Itoa(int(date.Weekday())) || weekDay == "*" {
			if weekDay == strconv.Itoa(int(date.Month())) || month == "*" {
				if monthDay == strconv.Itoa(date.Day()) || monthDay == "*" {
					if hour == strconv.Itoa(date.Hour()) || hour == "*" {
						if minute == strconv.Itoa(date.Minute()) || minute == "*" {
							log.Println(date.Format(time.DateTime))
						}
					}
				}
			}
		}
	}
}

// func socket() {
// 	conn, err := net.Listen("tcp", ":4500")
// 	if err != nil {
// 		log.Fatal("server error")
// 	}
// 	var conns []net.Conn = []net.Conn{}
// 	for {
// 		log.Println("Here")
// 		userConn, err := conn.Accept()
// 		buf := make([]byte, 1024)
// 		len, _ := userConn.Read(buf)
// 		headers := strings.Split(string(buf[:len]), "\r\n")
// 		var connHeaders map[string]string = map[string]string{}
// 		for _, header := range headers {
// 			valueKey := strings.Split(header, ":")
// 			if cap(valueKey) > 1 {
// 				connHeaders[valueKey[0]] = strings.Join(valueKey[1:], ":")[1:]
// 			}
// 		}
// 		if err != nil {
// 			log.Println("user couldnt connect")
// 			continue
// 		}
// 		magicString := "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
// 		swa := sha1.New()
// 		io.WriteString(swa, connHeaders["Sec-WebSocket-Key"]+magicString)
// 		swaSum := swa.Sum(nil)
// 		acceptWebsocket := base64.StdEncoding.EncodeToString(swaSum)
// 		userConn.Write([]byte("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + acceptWebsocket + "\r\n\r\n"))
// 		conns = append(conns, userConn)
// 		time.Sleep(time.Second * 40)
// 		for _, user := range conns {
// 			user.Write([]byte("1000000107hellowo"))
// 		}
// 	}

// }
