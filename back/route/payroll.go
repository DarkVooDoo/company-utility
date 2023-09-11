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
			http.Error(route.Response, "forbidden", http.StatusForbidden)
			return
		}
		route.Response.Header().Add("Content-Type", "application/json")
		route.Response.Write(body)
	})

}
