package model

import (
	"errors"
	"work/store"
	"work/util"
)

func GetNotifications(userToken string) []util.Notification {
	user, tokenErr := IsTokenValid(userToken)
	if tokenErr != nil {
		return nil
	}
	var id, message, date string
	var myNotification []util.Notification = []util.Notification{}
	db := store.DBInit()
	rows, err := db.Query(`SELECT alert_id, alert_message, TO_CHAR(AGE(NOW(), alert_date), 'YY-MM-DD-HH24-MI-SS') FROM Alert WHERE alert_user_id=$1`, user.User_id)
	if err != nil {
		return nil
	}
	for rows.Next() {
		rows.Scan(&id, &message, &date)
		formatedDate := "Il y a " + util.GetFormatedDate(date)
		myNotification = append(myNotification, util.Notification{Id: id, Message: message, Date: formatedDate})
	}
	return myNotification
}

func DeleteNotification(id string) error {
	db := store.DBInit()
	_, err := db.Exec(`DELETE FROM Alert WHERE alert_id=$1`, id)
	if err != nil {
		return errors.New("error")
	}
	return nil
}
