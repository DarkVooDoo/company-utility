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
			http.Error(route.Response, "unauthorized", http.StatusUnauthorized)
			return
		}
		companyId := route.Request.URL.Query().Get("companyId")
		currentShift, err := model.GetCurrentShift(user.User_id, companyId)
		if err != nil {
			http.Error(route.Response, "forbidden", http.StatusForbidden)
		}
		route.Response.Header().Add("Content-Type", "application/json")
		route.Response.Write(currentShift)
	})

	route.POST(func() {
		user, errToken := route.VerifyToken()
		if errToken != nil {
			http.Error(route.Response, "unauthorized", http.StatusUnauthorized)
			return
		}
		var company util.UpdateCurrentShift
		json.Unmarshal(route.Payload, &company)
		if dbErr := model.UpdateCurrentShift(user.User_id, company); dbErr != nil {
			http.Error(route.Response, "forbidden", http.StatusForbidden)
			return
		}
		route.Response.Write([]byte("Success"))
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
		route.Response.Write([]byte("Success"))

	})
}
