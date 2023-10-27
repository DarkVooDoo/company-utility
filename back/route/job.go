package route

import (
	"log"
	"net/http"
)

var NewJobRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = Route{Response: response, Request: request, Cors: "http://localhost:3000"}
	route.GET(func() {

	})

	route.POST(func() {
		// var payload util.NewJob
		// json.Unmarshal(route.Payload, &payload)
		// log.Println(payload)
		log.Println("Got a request")
		route.Response.Write([]byte("Hello"))
	})

	route.PUT(func() {

	})
}
