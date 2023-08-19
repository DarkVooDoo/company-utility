package route

import (
	"encoding/json"
	"io"
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
	} else if req.Method == http.MethodDelete {
		var deletePayload struct {
			Id string `json:"id"`
		}
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &deletePayload)
		err := model.DeleteNotification(deletePayload.Id)
		if err != nil {
			http.Error(res, "forbidden", http.StatusForbidden)
			return
		}
		res.Write([]byte("Success"))
	}
}
