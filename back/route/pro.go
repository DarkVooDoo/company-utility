package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

type Prorouter struct {
	Route
	Api model.Pro
}

func ProRoute(res http.ResponseWriter, req *http.Request) {
	var route = Route{Response: res, Request: req, Cors: "http://localhost:3000"}

	route.GET(func() {
		userToken := req.Header.Get("Authorization")
		if req.URL.Query().Has("companyId") {
			company, err := model.GetSingleEntreprise(req.URL.Query().Get("companyId"), userToken)
			if err != nil {
				route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "forbidden"})
				return
			}
			route.WriteJSON(http.StatusOK, company)

		} else if req.URL.Query().Has("type") {
			cType := req.URL.Query().Get("type")
			company, err := model.GetEntreprises(userToken, cType)
			if err != nil {
				route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
				return
			}
			route.WriteJSON(http.StatusOK, company)
		} else if req.Header.Get("x-path") == "setting" {
			setting, err := model.GetCompanySetting(route.GetQuery("cId"))
			if err != nil {
				route.WriteJSON(http.StatusForbidden, ResponseError{Msg: "Forbidden"})
				return
			}
			route.WriteJSON(http.StatusOK, setting)
		}
	})

	route.POST(func() {
		user, tokenError := route.VerifyToken()
		if tokenError != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		var companyData util.CreateCompany
		json.Unmarshal(route.Payload, &companyData)
		err := model.CreateCompany(companyData, user.User_id)
		if err != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
			return
		} else {
			route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})

		}
	})

	route.PATCH(func() {
		var updateCompany util.UpdateCompany
		json.Unmarshal(route.Payload, &updateCompany)
		_, err := route.VerifyToken()
		if err != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		if err := model.UpdateCompany(updateCompany); err != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
			return
		}
		route.WriteJSON(http.StatusOK, ResponseError{Msg: "Success"})
	})

	route.DELETE(func() {
		var delete struct {
			Id string `json:"id"`
		}
		_, err := route.VerifyToken()
		if err != nil {
			route.WriteJSON(http.StatusUnauthorized, ResponseError{Msg: "unauthorized"})
			return
		}
		json.Unmarshal(route.Payload, &delete)
		if err := model.DeleteCompany(delete.Id); err != nil {
			route.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "bad request"})
			return
		}
		route.WriteJSON(http.StatusOK, []byte("Success"))
	})

}
