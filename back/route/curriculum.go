package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

var CurriculumRoute = func(res http.ResponseWriter, req *http.Request) {
	route := Route{Response: res, Request: req, Cors: "http://localhost:5173"}

	route.POST(func() {
		var payload util.Curriculum
		user, err := route.VerifyToken()
		if err != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{"unauthorized"})
			return
		}
		json.Unmarshal(route.Payload, &payload)
		if err := model.CreateCurriculum(user.User_id, payload); err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{"Success"})
	})
}
