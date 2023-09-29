package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	"work/util"
)

var MemberRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = Route{Response: response, Request: request, Cors: "http://localhost:3000"}

	route.GET(func() {
		companyId := route.GetQuery("companyId")
		_, tokenErr := route.VerifyToken()
		if tokenErr != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		body, err := model.GetMembers(companyId)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, body)
	})

	route.POST(func() {
		var newMember util.NewMember
		user, err := route.VerifyToken()
		if err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		json.Unmarshal(route.Payload, &newMember)
		_, er := model.AddNewMember(user.User_id, newMember)
		if er != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})

	})

	route.PATCH(func() {
		var payload util.Role
		json.Unmarshal(route.Payload, &payload)
		if err := model.ChangeMemberRole(payload); err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})

	})

	route.DELETE(func() {
		var memberDelete util.DeleteMember
		user, err := route.VerifyToken()
		if err != nil {
			http.Error(response, "forbidden", http.StatusForbidden)
		}
		json.Unmarshal(route.Payload, &memberDelete)
		model.DeleteMember(user.User_id, memberDelete)
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})
	})
}
