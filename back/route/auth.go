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
			http.Error(res, "unathorized", http.StatusUnauthorized)
		} else {
			body, _ := json.Marshal(user)
			route.Response.Header().Set("Content-Type", "application/json")
			route.Response.Write(body)
		}
	})

	route.POST(func() {
		var user util.SignUserPayloadStruct
		json.Unmarshal(route.Payload, &user)
		returnedUser, err := model.SignInUser(user)
		if err != nil {
			http.Error(route.Response, "request error", http.StatusBadRequest)
			return
		}
		payload, _ := json.Marshal(returnedUser)
		route.Response.Header().Add("Content-Type", "application/json")
		route.Response.Write(payload)

	})
}
