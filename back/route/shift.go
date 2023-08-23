package route

import (
	"encoding/json"
	"io"
	"log"
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
	util.EnableCors(res, "http://localhost:3000")
	if req.Method == http.MethodPost {
		var payload PayloadStruct
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &payload)
		err := model.CreateShift(payload.Payload)
		if err != nil {
			http.Error(res, "error creating shift", http.StatusForbidden)
		} else {
			res.Header().Set("Content-Type", "application/json")
			res.Write(body)
		}
	} else if req.Method == http.MethodGet {
		if req.URL.Query().Has("companyId") {
			token := req.Header.Get("Authorization")
			companyId := req.URL.Query().Get("companyId")
			from := req.URL.Query().Get("from")
			to := req.URL.Query().Get("to")
			shift, err := model.GetUserShift(token, companyId, from, to)
			if err != nil {
				http.Error(res, "not content", http.StatusNoContent)
			} else {
				payload, _ := json.Marshal(shift)
				res.Header().Add("Content-Type", "application/json")
				res.Write(payload)
			}
		} else if req.URL.Query().Has("date") {
			companyId := req.URL.Query().Get("cId")
			date := req.URL.Query().Get("date")
			shift, err := model.GetDayShift(req.Header.Get("Authorization"), companyId, date)
			if err != nil {
				http.Error(res, "forbidden", http.StatusForbidden)
				return
			}
			body, _ := json.Marshal(shift)
			log.Println(shift)
			res.Header().Add("Content-Type", "application/json")
			res.Write(body)
		}
	} else if req.Method == http.MethodPut {
		var newShift ModifyPayload
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &newShift)
		err := model.ModifyShift(newShift.Shifts)
		if err != nil {
			http.Error(res, "bad request", http.StatusBadRequest)
		} else {
			res.Write([]byte("Success"))
		}
	} else if req.Method == http.MethodDelete {
		var delete struct {
			Id string `json:"id"`
		}
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &delete)
		if err := model.DeleteShift(delete.Id); err != nil {
			http.Error(res, "forbidden", http.StatusForbidden)
		} else {
			res.Write([]byte("Success"))
		}
	}
}
