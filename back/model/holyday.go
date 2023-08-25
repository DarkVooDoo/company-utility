package model

import (
	"errors"
	"work/util"
)

func RequestHolyday(userToken string, requestPayload util.HolydayRequestPayload) error {
	user, tokenErr := VerifyToken(userToken)
	if tokenErr != nil {
		return errors.New("error")
	}
	db := DBInit()
	_, err := db.Exec(`INSERT INTO Holyday (holyday_from, holyday_to, holyday_type, holyday_user_id, holyday_company_id) VALUES($1,$2,$3,$4,$5)`, requestPayload.From, requestPayload.To, requestPayload.Type, user.User_id, requestPayload.CompanyId)
	if err != nil {
		return errors.New("error")
	}
	return nil
}

func GetEmployeeHolydays(companyId string, userToken string) ([]util.Holyday, error) {
	var id, from, to, status string
	var holydays []util.Holyday
	user, tokenErr := VerifyToken(userToken)
	if tokenErr != nil {
		return []util.Holyday{}, errors.New("error")
	}
	db := DBInit()
	rows, err := db.Query(`SELECT holyday_id, holyday_from, holyday_to, holyday_status FROM Holyday WHERE holyday_company_id=$1 AND holyday_user_id=$2`, companyId, user.User_id)
	if err != nil {
		return []util.Holyday{}, errors.New("error")
	}
	for rows.Next() {
		rows.Scan(&id, &from, &to, &status)
		holydays = append(holydays, util.Holyday{Id: id, From: from, To: to, Status: status})
	}
	return holydays, nil
}

func GetPendingHolydaysCount(companyId string) (string, error) {
	var count string
	db := DBInit()
	row := db.QueryRow(`SELECT COUNT(*) FROM Holyday WHERE holyday_company_id=$1 AND holyday_status='En Attente'`, companyId)
	if err := row.Scan(&count); err != nil {
		return "", errors.New("error")
	}
	return count, nil
}
