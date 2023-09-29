package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

func AuthRoute(res http.ResponseWriter, req *http.Request) {
	var route = Route{Request: req, Response: res, Cors: "http://localhost:3000"}
	route.GET(func() {
		user, err := route.VerifyToken()
		if err != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		route.WriteJSON(http.StatusOK, user)

	})

	route.POST(func() {
		var user util.SignUserPayloadStruct
		json.Unmarshal(route.Payload, &user)
		returnedUser, err := model.SignInUser(user)
		if err != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
			return
		}
		route.WriteJSON(http.StatusOK, returnedUser)

	})
}
