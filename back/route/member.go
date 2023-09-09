package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	"work/util"
)

var MemberRoute = func(response http.ResponseWriter, request *http.Request) {
	var route = Route{Response: response, Request: request, Cors: "http://localhost:3000"}
	route.POST(func() {
		var newMember util.NewMember
		user, err := route.VerifyToken()
		if err != nil {
			http.Error(response, "forbidden", http.StatusForbidden)
		}
		json.Unmarshal(route.Payload, &newMember)
		model.AddNewMember(user.User_id, newMember)
	})

	route.DELETE(func() {
		var memberDelete util.DeleteMember
		user, err := route.VerifyToken()
		if err != nil {
			http.Error(response, "forbidden", http.StatusForbidden)
		}
		json.Unmarshal(route.Payload, &memberDelete)
		model.DeleteMember(user.User_id, memberDelete)
	})
}
