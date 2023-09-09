package model

import (
	"encoding/json"
	"errors"
	"work/db"
	"work/util"
)

func Search(search string) ([]byte, error) {
	db := db.DBInit()
	var user []util.SearchStruct = []util.SearchStruct{}
	var company []util.SearchStruct = []util.SearchStruct{}
	var id, name string
	var userCount, companyCount uint
	users, err := db.Query(`SELECT user_id, CONCAT(user_firstname, ' ', user_lastname), COUNT(user_id) FROM Users WHERE user_ts_search @@ to_tsquery('french', $1) GROUP BY user_id`, search)
	if err != nil {
		return nil, errors.New("Forbidden")
	}
	for users.Next() {
		users.Scan(&id, &name, &userCount)
		user = append(user, util.SearchStruct{Id: id, Name: name})
	}
	companys, errCompany := db.Query(`SELECT company_id, company_name, COUNT(company_id) FROM Company WHERE company_ts_search @@ to_tsquery('french', $1) GROUP BY company_id`, search)
	if errCompany != nil {
		return nil, errors.New("Forbidden")
	}
	for companys.Next() {
		companys.Scan(&id, &name, &companyCount)
		company = append(company, util.SearchStruct{Id: id, Name: name})
	}
	var result = util.SearchResult{
		UseCount:     userCount,
		CompanyCount: companyCount,
		Users:        user,
		Companys:     company,
	}
	body, _ := json.Marshal(result)
	return body, nil
}
