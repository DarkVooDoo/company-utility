package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

var UserRoute = func(res http.ResponseWriter, req *http.Request) {
	var router = Route{Request: req, Response: res, Cors: "http://localhost:3000"}

	router.GET(func() {
		userToken := req.Header.Get("Authorization")
		profile, error := model.GetUserProfile(userToken)
		body, err := json.Marshal(profile)
		if err != nil || error != nil {
			http.Error(res, "error from the server", http.StatusForbidden)
		} else {
			res.Header().Add("Content-Type", "application/json")
			res.Write(body)
		}
	})

	router.POST(func() {
		var newUser util.CreateUserStruct
		json.Unmarshal(router.Payload, &newUser)
		err := model.CreateUser(newUser)
		if err != nil {
			http.Error(res, "bad request", http.StatusBadRequest)
		} else {
			res.Write([]byte("User created"))
		}
	})

	router.PUT(func() {
		var modifyUser util.UserProfile
		userToken := req.Header.Get("Authorization")
		json.Unmarshal(router.Payload, &modifyUser)
		updateUser, err := model.ModifyProfile(modifyUser, userToken)
		if err != nil {
			http.Error(res, "Forbidden", http.StatusForbidden)
			return
		}
		payload, _ := json.Marshal(updateUser)
		res.Header().Add("Content-Type", "application/json")
		res.Write(payload)
	})
}
