package route

import (
	"context"
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"

	"google.golang.org/api/idtoken"
)

func AuthRoute(res http.ResponseWriter, req *http.Request) {
	var route = Route{Request: req, Response: res, Cors: "http://localhost:5173"}
	route.GET(func() {
		user, err := route.VerifyToken()
		if err != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		route.WriteJSON(http.StatusOK, user)
	})

	route.POST(func() {
		if route.Request.Header.Get("auth-type") != "" {
			var user struct {
				Token string `json:"token"`
			}
			json.Unmarshal(route.Payload, &user)
			payload, err := idtoken.Validate(context.Background(), user.Token, "")
			if err != nil {
				route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
				return
			}
			claim := payload.Claims
			claimUser := util.ReturnedTokenStruct{User_id: claim["sub"].(string), User_photo: claim["picture"].(string), User_name: claim["family_name"].(string) + claim["given_name"].(string), Token: user.Token}
			route.WriteJSON(http.StatusOK, claimUser)
			return
		}
		var user util.SignUserPayloadStruct
		json.Unmarshal(route.Payload, &user)
		returnedUser, err := model.SignInUser(user)
		if err != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
			return
		}
		route.WriteJSON(http.StatusOK, returnedUser)

	})
}
