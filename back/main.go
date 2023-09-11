package main

import (
	"log"
	"net/http"
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
	if err := s.ListenAndServe(); err != nil {
		log.Fatal("server crash")
	}
	log.Println("Server Started PORT" + PORT)
}
