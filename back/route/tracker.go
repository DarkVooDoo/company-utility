package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	"work/util"
)

func TrackerRoute(response http.ResponseWriter, request *http.Request) {
	route := &Route{Response: response, Request: request, Cors: "http://localhost:3000"}

	route.GET(func() {
		user, errToken := route.VerifyToken()
		if errToken != nil {
			route.WriteJSON(http.StatusUnauthorized, []byte("unauthorized"))
			return
		}
		companyId := route.GetQuery("companyId")
		currentShift, err := model.GetCurrentShift(user.User_id, companyId)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			return
		}
		route.WriteJSON(http.StatusOK, currentShift)
	})

	route.POST(func() {
		user, errToken := route.VerifyToken()
		if errToken != nil {
			route.WriteJSON(http.StatusUnauthorized, []byte("unauthorized"))
			return
		}
		var company util.UpdateCurrentShift
		json.Unmarshal(route.Payload, &company)
		if dbErr := model.UpdateCurrentShift(user.User_id, company); dbErr != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			return
		}
		route.WriteJSON(http.StatusOK, []byte("Success"))
	})

	route.PUT(func() {
		user, errToken := route.VerifyToken()
		if errToken != nil {
			http.Error(route.Response, "unauthorized", http.StatusUnauthorized)
			return
		}
		var company util.UpdateCurrentShift
		json.Unmarshal(route.Payload, &company)
		model.PauseCurrentShift(user.User_id, company)
		route.WriteJSON(http.StatusOK, []byte("Success"))

	})

	route.DELETE(func() {

	})
}
