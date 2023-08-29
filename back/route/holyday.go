package route

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"work/model"
	"work/util"
)

func HolydayRoute(res http.ResponseWriter, req *http.Request) {
	util.EnableCors(res, "http://localhost:3000")
	var router HandlerInterface = Handler{Req: req, Res: res}

	router.GET(res, req, func() {
		if req.URL.Query().Has("companyId") {
			companyId := req.URL.Query().Get("companyId")
			userToken := req.Header.Get("Authorization")
			holyday, err := model.GetEmployeeHolydays(companyId, userToken)
			if err != nil {
				http.Error(res, "forbidden", http.StatusForbidden)
			}
			body, _ := json.Marshal(holyday)
			res.Header().Add("Content-Type", "application/json")
			res.Write(body)
		}
	})

	router.POST(res, req, func() {
		userToken := req.Header.Get("Authorization")
		var requestPayload util.HolydayRequestPayload
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &requestPayload)
		holyday, err := model.RequestHolyday(userToken, requestPayload)
		if err != nil {
			http.Error(res, "forbidden", http.StatusForbidden)
			return
		}
		payload, _ := json.Marshal(holyday)
		res.Header().Add("Content-Type", "application/json")
		res.Write(payload)
	})

	router.DELETE(res, req, func() {
		var id struct {
			Id string `json:"id"`
		}
		payload, _ := io.ReadAll(req.Body)
		json.Unmarshal(payload, &id)
		log.Println(id)
		if err := model.RejectHolyday(id.Id); err != nil {
			http.Error(res, "forbidden", http.StatusForbidden)
			return
		}
		res.Write([]byte("Success"))
	})

}
