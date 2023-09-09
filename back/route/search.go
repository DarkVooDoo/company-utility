package route

import (
	"net/http"
	"work/model"
)

var SearchRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = &Route{Response: response, Request: request, Cors: "http://localhost:3000"}
	route.GET(func() {
		search := route.Request.URL.Query().Get("q")
		body, err := model.Search(search)
		if err != nil {
			http.Error(response, "forbidden", http.StatusForbidden)
		}
		route.Response.Header().Add("Content-Type", "application/json")
		route.Response.Write(body)
	})
}
