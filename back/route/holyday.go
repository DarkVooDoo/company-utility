package route

import (
	"encoding/json"
	"log"
	"net/http"
	"work/model"
	"work/util"
)

func HolydayRoute(res http.ResponseWriter, req *http.Request) {
	var route = Route{Request: req, Response: res, Cors: "http://localhost:5173"}

	route.GET(func() {
		companyId := route.GetQuery("companyId")
		user, tokenErr := route.VerifyToken()
		if !route.Request.URL.Query().Has("status") {
			if tokenErr != nil {
				route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
				return
			}
			holyday, err := model.GetEmployeeHolydays(companyId, user.User_id)
			if err != nil {
				route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
				return
			}
			route.WriteJSON(http.StatusOK, holyday)
		} else {
			status := route.GetQuery("status")
			log.Println("status")
			if status == "Aucun" {
				log.Println("aucun")

				holyday, err := model.GetAllHolyday(companyId)
				if err != nil {
					route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
				}
				route.WriteJSON(http.StatusOK, holyday)
				return
			} else {
				log.Println("why here")
				holyday, err := model.GetHolydayByStatus(companyId, status)
				if err != nil {
					route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
				}
				route.WriteJSON(http.StatusOK, holyday)
			}
		}
	})

	route.POST(func() {
		user, tokenErr := route.VerifyToken()
		if tokenErr != nil {
			route.WriteJSON(http.StatusUnauthorized, []byte("unauthorized"))
			return
		}
		var requestPayload util.HolydayRequestPayload
		json.Unmarshal(route.Payload, &requestPayload)
		holyday, err := model.RequestHolyday(user.User_id, requestPayload)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, holyday)
	})

	route.DELETE(func() {
		var payload struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &payload)
		if err := model.DeleteHolyday(payload.Id); err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})
	})

	route.PUT(func() {
		var payload struct {
			Id   string `json:"id"`
			Type string `json:"type"`
		}
		json.Unmarshal(route.Payload, &payload)
		if payload.Type == "reject" {
			if err := model.RejectHolyday(payload.Id); err != nil {
				route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			}
			return
		}
		if err := model.AcceptHolyday(payload.Id); err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})
	})
}
