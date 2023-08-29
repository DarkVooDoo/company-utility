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
	var router HandlerInterface = Handler{Req: req, Res: res}

	router.GET(res, req, func() {
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

	router.POST(res, req, func() {
		var newUser util.CreateUserStruct
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &newUser)
		err := model.CreateUser(newUser)
		if err != nil {
			http.Error(res, "bad request", http.StatusBadRequest)
		} else {
			res.Write([]byte("User created"))
		}
	})

	router.PUT(res, req, func() {
		var modifyUser util.UserProfile
		userToken := req.Header.Get("Authorization")
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &modifyUser)
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
