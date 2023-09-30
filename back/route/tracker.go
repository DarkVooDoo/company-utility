package route

import (
	"encoding/json"
	"log"
	"net/http"
	"work/model"
	"work/util"
)

func TrackerRoute(response http.ResponseWriter, request *http.Request) {
	route := &Route{Response: response, Request: request, Cors: "http://localhost:5173"}

	route.GET(func() {
		user, errToken := route.VerifyToken()
		if errToken != nil {
			route.WriteJSON(http.StatusUnauthorized, []byte("unauthorized"))
			return
		}
		companyId := route.GetQuery("companyId")
		if route.Request.URL.Query().Has("date") {
			date := route.GetQuery("date")
			log.Println(date)
			route.WriteJSON(http.StatusOK, user)
		} else {
			currentShift, err := model.GetCurrentShift(user.User_id, companyId)
			if err != nil {
				route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
				return
			}
			route.WriteJSON(http.StatusOK, currentShift)
		}

	})

	route.POST(func() {

		user, errToken := route.VerifyToken()
		if errToken != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		var company util.UpdateCurrentShift
		json.Unmarshal(route.Payload, &company)
		if dbErr := model.UpdateCurrentShift(user.User_id, company); dbErr != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, []byte("Success"))
	})

	route.PUT(func() {
		user, errToken := route.VerifyToken()
		if errToken != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		var company util.UpdateCurrentShift
		json.Unmarshal(route.Payload, &company)
		model.PauseCurrentShift(user.User_id, company)
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})

	})

	route.DELETE(func() {

	})
}
