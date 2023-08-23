package route

import (
	"encoding/json"
	"io"
	"net/http"
	"work/model"
	"work/util"
)

func HolydayRoute(res http.ResponseWriter, req *http.Request) {
	util.EnableCors(res, "http://localhost:3000")
	if req.Method == http.MethodGet {

	} else if req.Method == http.MethodPost {
		userToken := req.Header.Get("Authorization")
		var requestPayload util.HolydayRequestPayload
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &requestPayload)
		model.RequestHolyday(userToken, requestPayload)
		res.Write([]byte("Success"))
	}
}
