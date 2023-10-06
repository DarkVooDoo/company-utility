package route

import (
	"encoding/json"
	"log"
	"net/http"
	"work/util"
)

var NewJobRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = Route{Response: response, Request: request, Cors: "http://localhost:3000"}
	route.GET(func() {

	})

	route.POST(func() {
		var payload util.NewJob
		json.Unmarshal(route.Payload, &payload)
		log.Println(payload)
		route.Response.Write([]byte("Hello"))
	})

	route.PUT(func() {

	})
}
