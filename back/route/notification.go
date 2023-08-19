package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	"work/util"
)

func NotificationRoute(res http.ResponseWriter, req *http.Request) {
	util.EnableCors(res, "http://localhost:3000")
	if req.Method == http.MethodGet {
		userToken := req.Header.Get("Authorization")
		notification, err := model.GetNotifications(userToken)
		if err != nil {
			http.Error(res, "forbidden", http.StatusForbidden)
			return
		}
		body, _ := json.Marshal(notification)
		res.Header().Add("Content-Type", "application/json")
		res.Write(body)
	}
}
