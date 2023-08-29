package route

import (
	"encoding/json"
	"net/http"
	"work/model"
	util "work/util"
)

func ProRoute(res http.ResponseWriter, req *http.Request) {
	util.EnableCors(res, "http://localhost:3000")
	var handler HandlerInterface = Handler{Res: res, Req: req}

	handler.GET(res, req, func() {
		userToken := req.Header.Get("Authorization")
		if req.URL.Query().Has("companyId") {
			company, err := model.GetSingleEntreprise(req.URL.Query().Get("companyId"), userToken)
			if err != nil {
				http.Error(res, "redirect", http.StatusTemporaryRedirect)
			} else {
				body, _ := json.Marshal(company)
				res.Header().Add("Content-Type", "application/json")
				res.Write(body)
			}
		} else if req.URL.Query().Has("type") {
			cType := req.URL.Query().Get("type")
			company, err := model.GetEntreprises(userToken, cType)
			if err != nil {
				http.Error(res, "forbidden", http.StatusForbidden)
			} else {
				body, _ := json.Marshal(company)
				res.Header().Add("Content-Type", "application/json")
				res.Write(body)
			}
		}
	})

	handler.POST(res, req, func(body []byte) {
		var companyData util.CreateCompany
		token := req.Header.Get("Authorization")
		json.Unmarshal(body, &companyData)
		err := model.CreateCompany(companyData, token)
		if err != nil {
			http.Error(res, "error creating company", http.StatusBadRequest)
		} else {
			res.Write([]byte("Success"))
		}
	})

}
