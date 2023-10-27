package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

var UserRoute = func(res http.ResponseWriter, req *http.Request) {
	var route = Route{Request: req, Response: res, Cors: "http://localhost:3000"}

	route.GET(func() {
		user, err := route.VerifyToken()
		if err != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		profile, er := model.GetUserProfile(user.User_id)
		if er != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
			return
		}
		route.WriteJSON(http.StatusOK, profile)
	})

	route.POST(func() {
		var newUser util.CreateUserStruct
		json.Unmarshal(route.Payload, &newUser)
		err := model.CreateUser(newUser)
		if err != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
		} else {
			res.Write([]byte("User created"))
		}
	})

	route.PUT(func() {
		user, tokenErr := route.VerifyToken()
		if tokenErr != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		var modifyUser util.UserProfile
		json.Unmarshal(route.Payload, &modifyUser)
		updateUser, err := model.ModifyProfile(modifyUser, user.User_id)
		if err != nil {
			route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "bad request"})
			return
		}
		route.WriteJSON(http.StatusOK, updateUser)
	})

	route.PATCH(func() {
		file := route.MultipartForm.File["photo"]
		photoId := route.MultipartForm.Value["photoId"]
		user, err := route.VerifyToken()
		if err != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		if err := model.UpdateUserPhoto(user.User_id, photoId, file); err != nil {
			route.WriteJSON(http.StatusInternalServerError, ResponseError{Msg: "server error"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})
	})
}
