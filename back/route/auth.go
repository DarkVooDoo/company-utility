package route

import (
	"encoding/json"
	"io"
	"net/http"
	"work/model"
	util "work/util"
)

func AuthRoute(res http.ResponseWriter, req *http.Request) {
	util.EnableCors(res, "http://localhost:3000")
	if req.Method == http.MethodGet {
		auth := req.Header.Get("Authorization")
		user, err := model.VerifyToken(auth)
		if err != nil {
			http.Error(res, "unathorized", http.StatusUnauthorized)
		} else {
			body, _ := json.Marshal(user)
			res.Write(body)
		}
	} else if req.Method == http.MethodPost {
		var user util.SignUserPayloadStruct
		var body, _ = io.ReadAll(req.Body)
		json.Unmarshal(body, &user)
		returnedUser, err := model.SignInUser(user)
		if err != nil {
			http.Error(res, "request error", 400)
		} else {
			payload, _ := json.Marshal(returnedUser)
			res.Header().Add("Content-Type", "application/json")
			res.Write(payload)
		}
	}
}
