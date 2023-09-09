package route

import (
	"encoding/json"
	"log"
	"net/http"
	"work/model"
	"work/util"
)

var NewJobRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = Route{Response: response, Request: request, Cors: "http://localhost:3000"}
	route.GET(func() {
		body, err := model.GetUserHours()
		if err != nil {
			http.Error(route.Response, "forbidden", http.StatusForbidden)
			return
		}
		route.Response.Header().Add("Content-Type", "application/json")
		route.Response.Write(body)
	})

	route.POST(func() {
		var payload util.NewJob
		json.Unmarshal(route.Payload, &payload)
		log.Println(payload)
		route.Response.Write([]byte("Hello"))
	})
}
