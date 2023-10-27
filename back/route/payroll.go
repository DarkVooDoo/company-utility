package route

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"work/model"
	"work/util"
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

	route.POST(func() {
		var payload struct {
			Salary float64 `json:"salary"`
		}
		json.Unmarshal(route.Payload, &payload)
		log.Println(payload.Salary)
		// allocationFamiliale := util.RoundFloat(payload.Salaire * 3.45, 2)
		// fmt.Printf("Allocation Familiale: ", allocationFamiliale)
		securitePlafonee := util.RoundFloat(payload.Salary*6.9/100, 2)
		fmt.Println("Sécurité Sociale plafonnée: ", securitePlafonee)
		securiteDeplafonee := util.RoundFloat(payload.Salary*0.4/100, 2)
		fmt.Println("Sécurité Sociale déplafonnée: ", securiteDeplafonee)
		csgCRDS := util.RoundFloat(payload.Salary*2.9/100, 2)
		fmt.Println("CSG/CRDS: ", csgCRDS)
		csg := util.RoundFloat(payload.Salary*6.8/100, 2)
		fmt.Println("CSG déduct. de l'impôt sur le revenu: ", csg)

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
