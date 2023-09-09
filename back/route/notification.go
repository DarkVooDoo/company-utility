package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

var NotificationRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = &Route{Response: response, Request: request, Cors: "http://localhost:3000"}
	// var route HandlerInterface = Handler{Response: response, Request: request}
	util.EnableCors(response, "http://localhost:3000")
	route.GET(func() {
		notif := model.GetNotifications(request.Header.Get("Authorization"))
		if notif == nil {
			http.Error(response, "error", http.StatusForbidden)
			return
		}
		response.Header().Add("Content-Type", "application/json")
		response.Write(notif)
	})

	route.DELETE(func() {
		var deletePayload struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &deletePayload)
		response.Write(model.DeleteNotification(deletePayload.Id))
	})
}
