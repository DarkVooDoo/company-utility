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
		companyId := route.Request.URL.Query().Get("companyId")
		user, tokenErr := route.VerifyToken()
		if tokenErr != nil {
			http.Error(route.Response, "unauthorized", http.StatusUnauthorized)
			return
		}
		body, err := model.GetMembers(companyId, user.User_id)
		if err != nil {
			http.Error(route.Response, "forbidden", http.StatusForbidden)
		}
		route.Response.Header().Add("Content-Type", "application/json")
		route.Response.Write(body)
	})

	route.POST(func() {
		var newMember util.NewMember
		user, err := route.VerifyToken()
		if err != nil {
			http.Error(response, "forbidden", http.StatusForbidden)
		}
		json.Unmarshal(route.Payload, &newMember)
		model.AddNewMember(user.User_id, newMember)
		route.Response.Write([]byte("Success"))
	})

	route.PATCH(func() {
		var payload util.Role
		json.Unmarshal(route.Payload, &payload)
		if err := model.ChangeMemberRole(payload); err != nil {
			http.Error(route.Response, "forbidden", http.StatusForbidden)
			return
		}
		route.Response.Write([]byte("Success"))
	})

	route.DELETE(func() {
		var memberDelete util.DeleteMember
		user, err := route.VerifyToken()
		if err != nil {
			http.Error(response, "forbidden", http.StatusForbidden)
		}
		json.Unmarshal(route.Payload, &memberDelete)
		model.DeleteMember(user.User_id, memberDelete)
		route.Response.Write([]byte("Success"))
	})
}
