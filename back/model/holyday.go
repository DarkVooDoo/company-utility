package model

import (
	"errors"
	"work/util"
)

func RequestHolyday(userToken string, requestPayload util.HolydayRequestPayload) (util.Holyday, error) {
	var id, from, to, status string
	user, tokenErr := VerifyToken(userToken)
	if tokenErr != nil {
		return util.Holyday{}, errors.New("error")
	}
	db := DBInit()
	row := db.QueryRow(`INSERT INTO Holyday (holyday_from, holyday_to, holyday_type, holyday_user_id, holyday_company_id) VALUES($1,$2,$3,$4,$5)
	RETURNING holyday_id, TO_CHAR(holyday_from, 'DD-MM-YYYY'), TO_CHAR(holyday_to, 'DD-MM-YYYY'), holyday_status`, requestPayload.From, requestPayload.To, requestPayload.Type, user.User_id, requestPayload.CompanyId)
	if err := row.Scan(&id, &from, &to, &status); err != nil {
		return util.Holyday{}, errors.New("error")
	}
	return util.Holyday{Id: id, From: from, To: to, Status: status}, nil
}

func GetEmployeeHolydays(companyId string, userToken string) ([]util.Holyday, error) {
	user, tokenErr := VerifyToken(userToken)
	if tokenErr != nil {
		return []util.Holyday{}, errors.New("error")
	}
	return getHolydays(`SELECT holyday_id, TO_CHAR(AGE(NOW(), holyday_sended), 'YY-MM-DD-HH24-MI-SS'), TO_CHAR(holyday_from, 'DD-MM-YYYY'),
	TO_CHAR(holyday_to, 'DD-MM-YYYY'), holyday_status, CONCAT(user_firstname, ' ', user_lastname) FROM Holyday LEFT JOIN Users ON user_id=holyday_user_id 
	WHERE holyday_company_id=$1 AND holyday_user_id=$2`, companyId, user.User_id)
}

func GetPendingHolydays(companyId string) ([]util.Holyday, error) {
	return getHolydays(`SELECT holyday_id, TO_CHAR(AGE(NOW(), holyday_sended), 'YY-MM-DD-HH24-MI-SS'), TO_CHAR(holyday_from, 'DD-MM-YYYY'),
	TO_CHAR(holyday_to, 'DD-MM-YYYY'), holyday_status, CONCAT(user_firstname, ' ', user_lastname) FROM Holyday LEFT JOIN Users 
	ON user_id=holyday_user_id WHERE holyday_company_id=$1 AND holyday_status='En Attente'`, companyId)
}

func RejectHolyday(id string) error {
	db := DBInit()
	if _, err := db.Exec(`UPDATE Holyday SET holyday_status='Refusé' WHERE holyday_id=$1`, id); err != nil {
		return errors.New("error")
	}
	return nil
}

func getHolydays(query string, args ...any) ([]util.Holyday, error) {
	var id, from, to, status, time, name string
	var holydays []util.Holyday
	db := DBInit()
	rows, err := db.Query(query, args...)
	if err != nil {
		return []util.Holyday{}, errors.New("error")
	}
	for rows.Next() {
		rows.Scan(&id, &time, &from, &to, &status, &name)
		holydays = append(holydays, util.Holyday{Id: id, From: from, To: to, Name: name, Status: status, Time: util.GetFormatedDate(time)})
	}
	return holydays, nil
}
