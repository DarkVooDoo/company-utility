package route

import (
	"encoding/json"
	"net/http"
	"work/model"
)

var NotificationRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = &Route{Response: response, Request: request, Cors: "http://localhost:3000"}
	route.GET(func() {
		notif := model.GetNotifications(request.Header.Get("Authorization"))
		if notif == nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			return
		}
		route.WriteJSON(http.StatusOK, notif)
	})

	route.DELETE(func() {
		var deletePayload struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &deletePayload)
		response.Write(model.DeleteNotification(deletePayload.Id))
	})
}
