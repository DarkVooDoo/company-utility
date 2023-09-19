package route

import (
	"encoding/json"
	"net/http"
	"work/model"
)

var PayrollRoute = func(res http.ResponseWriter, req *http.Request) {
	route := Route{Response: res, Request: req, Cors: "http://localhost:3000"}

	route.GET(func() {
		companyId := route.GetQuery("companyId")
		from := route.GetQuery("from")
		to := route.GetQuery("to")
		userId := route.GetQuery("uId")
		hours, err := model.GetAccumulateHours(companyId, from, to, userId)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			return
		}
		body, _ := json.Marshal(hours)
		route.WriteJSON(http.StatusOK, body)

	})

	route.DELETE(func() {
		var hour struct {
			Id string `json:"id"`
		}
		json.Unmarshal(route.Payload, &hour)
		if err := model.DeleteHour(hour.Id); err != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
		}
		route.Response.Write([]byte("success"))
	})

}
