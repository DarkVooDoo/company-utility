package main

import (
	"log"
	"net/http"
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
}

func main() {
	mux := http.NewServeMux()
	for route, funcHandler := range Routes {
		mux.HandleFunc(route, funcHandler)
	}
	log.Println("Server PORT: " + PORT)
	http.ListenAndServe(":"+PORT, mux)

}
