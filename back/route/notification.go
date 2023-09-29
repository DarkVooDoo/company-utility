package route

import (
	"encoding/json"
	"net/http"
	"work/model"
)

var NotificationRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = &Route{Response: response, Request: request, Cors: "http://localhost:5173"}
	route.GET(func() {
		notif := model.GetNotifications(request.Header.Get("Authorization"))
		if notif == nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, notif)
	})

	route.DELETE(func() {
		var deletePayload struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &deletePayload)
		if err := model.DeleteNotification(deletePayload.Id); err != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})
	})
}
