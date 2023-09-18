package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	"work/util"
)

func HolydayRoute(res http.ResponseWriter, req *http.Request) {
	var route = Route{Request: req, Response: res, Cors: "http://localhost:3000"}

	route.GET(func() {
		if route.Request.URL.Query().Has("companyId") {
			companyId := route.GetQuery("companyId")
			userToken := route.Request.Header.Get("Authorization")
			holyday, err := model.GetEmployeeHolydays(companyId, userToken)
			if err != nil {
				route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
				return
			}
			body, _ := json.Marshal(holyday)
			route.WriteJSON(http.StatusOK, body)
		}
	})

	route.POST(func() {
		userToken := route.Request.Header.Get("Authorization")
		var requestPayload util.HolydayRequestPayload
		json.Unmarshal(route.Payload, &requestPayload)
		holyday, err := model.RequestHolyday(userToken, requestPayload)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			return
		}
		payload, _ := json.Marshal(holyday)
		route.WriteJSON(http.StatusOK, payload)
	})

	route.DELETE(func() {
		var payload struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &payload)
		if err := model.DeleteHolyday(payload.Id); err != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			return
		}
		route.WriteJSON(http.StatusOK, []byte("Success"))
	})

	route.PUT(func() {
		var payload struct {
			Id   string `json:"id"`
			Type string `json:"type"`
			User string `json:"userId"`
		}
		json.Unmarshal(route.Payload, &payload)
		if payload.Type == "reject" {
			if err := model.RejectHolyday(payload.Id, payload.User); err != nil {
				route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			}
			return
		}
		if err := model.AcceptHolyday(payload.Id, payload.User); err != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))

		}
		route.WriteJSON(http.StatusOK, []byte("Success"))
	})
}
