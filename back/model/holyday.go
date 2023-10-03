package model

import (
	"errors"
	"log"
	"work/db"
	"work/util"
)

func RequestHolyday(userId string, requestPayload util.HolydayRequestPayload) (util.Holyday, error) {
	var id, from, to, status string
	db := db.DBInit()
	row := db.QueryRow(`INSERT INTO Holyday (holyday_from, holyday_to, holyday_type, holyday_user_id, holyday_company_id) VALUES($1,$2,$3,$4,$5)
	RETURNING holyday_id, TO_CHAR(holyday_from, 'DD-MM-YYYY'), TO_CHAR(holyday_to, 'DD-MM-YYYY'), holyday_status`, requestPayload.From, requestPayload.To, requestPayload.Type, userId, requestPayload.CompanyId)
	if err := row.Scan(&id, &from, &to, &status); err != nil {
		return util.Holyday{}, errors.New("error")
	}
	return util.Holyday{Id: id, From: from, To: to, Status: status}, nil
}

func GetEmployeeHolydays(companyId string, userId string) ([]util.Holyday, error) {
	return getHolydays(`SELECT holyday_id, TO_CHAR(AGE(NOW(), holyday_sended), 'YY-MM-DD-HH24-MI-SS'), TO_CHAR(holyday_from, 'DD-MM-YYYY'),
	TO_CHAR(holyday_to, 'DD-MM-YYYY'), holyday_status, CONCAT(user_firstname, ' ', user_lastname), holyday_user_id FROM Holyday LEFT JOIN Users ON user_id=holyday_user_id 
	WHERE holyday_company_id=$1 AND holyday_user_id=$2`, companyId, userId)
}

func GetHolydayByStatus(companyId string, status string) ([]util.Holyday, error) {
	return getHolydays(`SELECT holyday_id, TO_CHAR(AGE(NOW(), holyday_sended), 'YY-MM-DD-HH24-MI-SS'), TO_CHAR(holyday_from, 'DD-MM-YYYY'),
	TO_CHAR(holyday_to, 'DD-MM-YYYY'), holyday_status, CONCAT(user_firstname, ' ', user_lastname), holyday_user_id FROM Holyday LEFT JOIN Users 
	ON user_id=holyday_user_id WHERE holyday_company_id=$1 AND holyday_status=$2 LIMIT 10`, companyId, status)
}

func GetAllHolyday(companyId string) ([]util.Holyday, error) {
	return getHolydays(`SELECT holyday_id, TO_CHAR(AGE(NOW(), holyday_sended), 'YY-MM-DD-HH24-MI-SS'), TO_CHAR(holyday_from, 'DD-MM-YYYY'),
	TO_CHAR(holyday_to, 'DD-MM-YYYY'), holyday_status, CONCAT(user_firstname, ' ', user_lastname), holyday_user_id FROM Holyday LEFT JOIN Users 
	ON user_id=holyday_user_id WHERE holyday_company_id=$1 LIMIT 10`, companyId)
}

func RejectHolyday(id string) error {
	var userId string
	db := db.DBInit()
	tx, _ := db.Begin()
	row := tx.QueryRow(`UPDATE Holyday SET holyday_status='Refusé' WHERE holyday_id=$1 RETURNING holyday_user_id`, id)
	if err := row.Scan(&userId); err != nil {
		tx.Rollback()
		return errors.New("error")
	}
	if _, notifErr := tx.Exec(`INSERT INTO Alert (alert_message, alert_user_id) VALUES ('Votre vacances a été refusée', $1) `, userId); notifErr != nil {
		tx.Rollback()
		return errors.New("error")
	}
	tx.Commit()
	return nil
}

func AcceptHolyday(id string) error {
	var userId string
	db := db.DBInit()
	tx, _ := db.Begin()
	row := tx.QueryRow(`UPDATE Holyday SET holyday_status='Validé' WHERE holyday_id=$1 RETURNING holyday_user_id`, id)
	if err := row.Scan(&userId); err != nil {
		tx.Rollback()
		return errors.New("error")
	}
	if _, notifErr := tx.Exec(`INSERT INTO Alert (alert_message, alert_user_id) VALUES ('Votre vacances a été acceptée', $1) `, userId); notifErr != nil {
		tx.Rollback()
		return errors.New("error")
	}
	if commitErr := tx.Commit(); commitErr != nil {
		return errors.New("error")
	}
	return nil
}

func DeleteHolyday(id string) error {
	db := db.DBInit()
	_, err := db.Exec(`DELETE FROM Holyday WHERE holyday_id=$1`, id)
	return err
}

func getHolydays(query string, args ...any) ([]util.Holyday, error) {
	var id, from, to, status, time, name, user string
	holydays := []util.Holyday{}
	db := db.DBInit()
	rows, err := db.Query(query, args...)
	if err != nil {
		log.Println(err)
		return []util.Holyday{}, errors.New("error")
	}
	for rows.Next() {
		rows.Scan(&id, &time, &from, &to, &status, &name, &user)
		holydays = append(holydays, util.Holyday{Id: id, From: from, To: to, Name: name, User: user, Status: status, Time: util.GetFormatedDate(time)})
	}
	return holydays, nil
}
