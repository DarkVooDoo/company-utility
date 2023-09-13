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
		auth := route.Request.Header.Get("Authorization")
		user, err := model.VerifyToken(auth)
		if err != nil {
			route.WriteJSON(http.StatusUnauthorized, []byte("unauthorized"))
			return
		}
		body, _ := json.Marshal(user)
		route.WriteJSON(http.StatusOK, body)

	})

	route.POST(func() {
		var user util.SignUserPayloadStruct
		json.Unmarshal(route.Payload, &user)
		returnedUser, err := model.SignInUser(user)
		if err != nil {
			route.WriteJSON(http.StatusBadRequest, []byte("request error"))
			return
		}
		payload, _ := json.Marshal(returnedUser)
		route.WriteJSON(http.StatusOK, payload)

	})
}
