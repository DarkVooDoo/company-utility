package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

type PayloadStruct struct {
	Payload []util.ShiftStruct `json:"payload"`
}

type ModifyPayload struct {
	Shifts []util.ModifyShiftStruct `json:"shifts"`
}

var ShiftRoute = func(res http.ResponseWriter, req *http.Request) {

	var route = Route{Response: res, Request: req, Cors: "http://localhost:3000"}

	route.GET(func() {
		if route.Request.URL.Query().Has("cId") {
			emp, err := model.CompanyEmployee(req.URL.Query().Get("cId"))
			if err != nil {
				route.WriteJSON(http.StatusBadRequest, []byte("error"))
				return
			}
			body, _ := json.Marshal(emp)
			route.WriteJSON(http.StatusOK, body)

		} else if req.URL.Query().Has("companyId") {
			token := route.Request.Header.Get("Authorization")
			companyId := route.GetQuery("companyId")
			from := route.GetQuery("from")
			to := route.GetQuery("to")
			shift, err := model.GetUserShift(token, companyId, from, to)
			if err != nil {
				http.Error(route.Response, "not content", http.StatusNoContent)
				return
			}
			payload, _ := json.Marshal(shift)
			route.WriteJSON(http.StatusOK, payload)

		} else if req.URL.Query().Has("date") {
			companyId := route.GetQuery("company")
			date := route.GetQuery("date")
			shift, err := model.GetDayShift(route.Request.Header.Get("Authorization"), companyId, date)
			if err != nil {
				http.Error(route.Response, "forbidden", http.StatusForbidden)
				return
			}
			body, _ := json.Marshal(shift)
			route.Response.Header().Add("Content-Type", "application/json")
			route.Response.Write(body)
		}
	})

	route.POST(func() {
		var payload PayloadStruct
		json.Unmarshal(route.Payload, &payload)
		err := model.CreateShift(payload.Payload)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			return
		}
		route.WriteJSON(http.StatusOK, route.Payload)

	})

	route.PUT(func() {
		var newShift ModifyPayload
		json.Unmarshal(route.Payload, &newShift)
		err := model.ModifyShift(newShift.Shifts)
		if err != nil {
			http.Error(route.Response, "bad request", http.StatusBadRequest)
		} else {
			route.Response.Write([]byte("Success"))
		}
	})

	route.DELETE(func() {
		var delete struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &delete)
		if err := model.DeleteShift(delete.Id); err != nil {
			http.Error(route.Response, "forbidden", http.StatusForbidden)
		} else {
			route.Response.Write([]byte("Success"))
		}
	})

}
