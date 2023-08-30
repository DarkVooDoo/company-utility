package route

import (
	"encoding/json"
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

	router.POST(res, req, func(body []byte) {
		userToken := req.Header.Get("Authorization")
		var requestPayload util.HolydayRequestPayload
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

	router.DELETE(res, req, func(body []byte) {
		var payload struct {
			Id string `json:"id"`
		}
		json.Unmarshal(body, &payload)
		if err := model.DeleteHolyday(payload.Id); err != nil {
			http.Error(res, "forbidden", http.StatusForbidden)
			return
		}
		res.Write([]byte("Success"))
	})

	router.PUT(res, req, func(body []byte) {
		var payload struct {
			Id   string `json:"id"`
			Type string `json:"type"`
		}
		json.Unmarshal(body, &payload)
		if payload.Type == "reject" {
			if err := model.RejectHolyday(payload.Id); err != nil {
				http.Error(res, "forbidden", http.StatusForbidden)
			}
			return
		}
		if err := model.AcceptHolyday(payload.Id); err != nil {
			http.Error(res, "forbidden", http.StatusForbidden)
		}
		res.Write([]byte("Success"))
	})
}
