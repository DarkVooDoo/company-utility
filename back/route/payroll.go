package route

import (
	"encoding/json"
	"net/http"
	"work/model"
)

var PayrollRoute = func(res http.ResponseWriter, req *http.Request) {
	route := Route{Response: res, Request: req, Cors: "http://localhost:5173"}

	route.GET(func() {
		companyId := route.GetQuery("companyId")
		userId := route.GetQuery("uId")
		if req.URL.Query().Has("date") {
			date := route.GetQuery("date")
			hours, err := model.GetAccumulateHours(companyId, date, userId)
			if err != nil {
				route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
				return
			}
			route.WriteJSON(http.StatusOK, hours)
		} else {
			from := route.GetQuery("from")
			to := route.GetQuery("to")
			hours, err := model.GetAccumulateHoursFromTo(companyId, from, to, userId)
			if err != nil {
				route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
				return
			}
			route.WriteJSON(http.StatusOK, hours)
		}

	})

	route.DELETE(func() {
		var hour struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &hour)
		if err := model.DeleteHour(hour.Id); err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})
	})

}
