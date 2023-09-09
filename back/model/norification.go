package model

import (
	"encoding/json"
	"work/db"
	"work/util"
)

func GetNotifications(userToken string) []byte {
	user, tokenErr := VerifyToken(userToken)
	if tokenErr != nil {
		return nil
	}
	var id, message, date string
	var myNotification []util.Notification = []util.Notification{}
	db := db.DBInit()
	rows, err := db.Query(`SELECT alert_id, alert_message, TO_CHAR(AGE(NOW(), alert_date), 'YY-MM-DD-HH24-MI-SS') FROM Alert WHERE alert_user_id=$1`, user.User_id)
	if err != nil {
		return nil
	}
	for rows.Next() {
		rows.Scan(&id, &message, &date)
		formatedDate := "Il y a " + util.GetFormatedDate(date)
		myNotification = append(myNotification, util.Notification{Id: id, Message: message, Date: formatedDate})
	}
	body, _ := json.Marshal(myNotification)
	return body
}

func DeleteNotification(id string) []byte {
	db := db.DBInit()
	_, err := db.Exec(`DELETE FROM Alert WHERE alert_id=$1`, id)
	if err != nil {
		return nil
	}
	return []byte("Success")
}
