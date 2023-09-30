package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

type PayloadStruct struct {
	Planning []util.CreateShift `json:"planning"`
	Company  string             `json:"companyId"`
}

type ModifyPayload struct {
	Shifts []util.ModifyShiftStruct `json:"shifts"`
}

var ShiftRoute = func(res http.ResponseWriter, req *http.Request) {

	var route = Route{Response: res, Request: req, Cors: "http://localhost:5173"}

	route.GET(func() {
		if route.Request.URL.Query().Has("cId") {
			emp, err := model.CompanyEmployee(req.URL.Query().Get("cId"))
			if err != nil {
				route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
				return
			}
			route.WriteJSON(http.StatusOK, emp)
		} else if req.URL.Query().Has("companyId") {
			user, errToken := route.VerifyToken()
			if errToken != nil {
				route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
				return
			}
			companyId := route.GetQuery("companyId")
			from := route.GetQuery("from")
			to := route.GetQuery("to")
			shift, err := model.GetUserShift(user.User_id, companyId, from, to)
			if err != nil {
				route.WriteJSON(http.StatusNoContent, ResponseError{Msg: "not content"})
				return
			}
			route.WriteJSON(http.StatusOK, shift)

		} else if req.URL.Query().Has("date") {
			_, tokenErr := route.VerifyToken()
			if tokenErr != nil {
				route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
				return
			}
			companyId := route.GetQuery("company")
			date := route.GetQuery("date")
			id := route.GetQuery("userId")
			shift, err := model.GetDayShift(id, companyId, date)
			if err != nil {
				route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
				return
			}
			route.WriteJSON(http.StatusOK, shift)
		}
	})

	route.POST(func() {
		var payload PayloadStruct
		if err := json.Unmarshal(route.Payload, &payload); err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
		}
		err := model.CreateShift(payload.Planning, payload.Company)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, "kek")

	})

	route.PUT(func() {
		var newShift ModifyPayload
		json.Unmarshal(route.Payload, &newShift)
		err := model.ModifyShift(newShift.Shifts)
		if err != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})

	})

	route.DELETE(func() {
		var delete struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &delete)
		if err := model.DeleteShift(delete.Id); err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})
	})

}
