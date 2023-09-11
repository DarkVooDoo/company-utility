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

	var route = &Route{Response: res, Request: req, Cors: "http://localhost:3000"}

	route.GET(func() {
		if route.Request.URL.Query().Has("cId") {
			emp, err := model.Pro{}.CompanyEmployee(req.URL.Query().Get("cId"))
			if err != nil {
				http.Error(route.Response, err.Error(), http.StatusBadRequest)
			} else {
				payload, _ := json.Marshal(emp)
				route.Response.Header().Set("Content-Type", "application/json")
				route.Response.Write(payload)
			}
		} else if req.URL.Query().Has("companyId") {
			token := route.Request.Header.Get("Authorization")
			companyId := route.Request.URL.Query().Get("companyId")
			from := route.Request.URL.Query().Get("from")
			to := route.Request.URL.Query().Get("to")
			shift, err := model.GetUserShift(token, companyId, from, to)
			if err != nil {
				http.Error(route.Response, "not content", http.StatusNoContent)
			} else {
				payload, _ := json.Marshal(shift)
				route.Response.Header().Add("Content-Type", "application/json")
				route.Response.Write(payload)
			}
		} else if req.URL.Query().Has("date") {
			companyId := route.Request.URL.Query().Get("company")
			date := route.Request.URL.Query().Get("date")
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
			http.Error(route.Response, "error creating shift", http.StatusForbidden)
		} else {
			route.Response.Header().Set("Content-Type", "application/json")
			route.Response.Write(route.Payload)
		}
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
