package main

import (
	"log"
	"net/http"
	"work/route"
)

const (
	PORT = "5000"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/user", route.UserRoute)
	mux.HandleFunc("/api/pro", route.ProRoute)
	mux.HandleFunc("/api/member", route.MemberRoute)
	mux.HandleFunc("/api/auth", route.AuthRoute)
	mux.HandleFunc("/api/shift", route.ShiftRoute)
	log.Println("Server PORT: " + PORT)
	http.ListenAndServe(":"+PORT, mux)

}
