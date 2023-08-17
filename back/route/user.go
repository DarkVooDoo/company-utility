package route

import (
	"encoding/json"
	"io"
	"net/http"
	"work/model"
	"work/util"
)

var UserRoute = func(res http.ResponseWriter, req *http.Request) {
	util.EnableCors(res, "http://localhost:3000")
	if req.Method == http.MethodGet {
		userToken := req.Header.Get("Authorization")
		profile, error := model.GetUserProfile(userToken)
		body, err := json.Marshal(profile)
		if err != nil || error != nil {
			http.Error(res, "error from the server", http.StatusForbidden)
		} else {
			res.Header().Add("Content-Type", "application/json")
			res.Write(body)
		}
	} else if req.Method == http.MethodPost {
		var newUser util.CreateUserStruct
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &newUser)
		err := model.CreateUser(newUser)
		if err != nil {
			http.Error(res, "bad request", http.StatusBadRequest)
		} else {
			res.Write([]byte("User created"))
		}
	} else if req.Method == http.MethodPut {
		var modifyUser util.UserProfile
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &modifyUser)
		err := model.ModifyProfile(modifyUser)
		if err != nil {
			http.Error(res, "Forbidden", http.StatusForbidden)
		} else {
			res.Write([]byte("Success"))
		}
	}
}
