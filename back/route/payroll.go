package route

import (
	"net/http"
	"work/model"
)

var PayrollRoute = func(res http.ResponseWriter, req *http.Request) {
	route := Route{Response: res, Request: req, Cors: "http://localhost:3000"}

	route.GET(func() {
		companyId := route.Request.URL.Query().Get("companyId")
		from := route.Request.URL.Query().Get("from")
		to := route.Request.URL.Query().Get("to")

		body, err := model.GetAccumulateHours(companyId, from, to)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, []byte("forbidden"))
			return
		}
		route.WriteJSON(http.StatusOK, body)

	})

}
