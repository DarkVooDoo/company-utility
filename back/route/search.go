package route

import (
	"net/http"
	"work/model"
)

var SearchRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = &Route{Response: response, Request: request, Cors: "http://localhost:3000"}
	route.GET(func() {
		search := route.GetQuery("q")
		body, err := model.Search(search)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, body)
	})
}
