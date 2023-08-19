package model

import (
	"errors"
	"strconv"
	"strings"
	"work/util"
)

func GetNotifications(userToken string) ([]util.Notification, error) {
	var id, message, date string
	var myNotification []util.Notification
	user, err := VerifyToken(userToken)
	if err != nil {
		return []util.Notification{}, errors.New("error")
	}
	db := DBInit()
	rows, err := db.Query(`SELECT alert_id, alert_message, TO_CHAR(AGE(NOW(), alert_date), 'YY-MM-DD-HH24-MI-SS') FROM Alert WHERE alert_user_id=$1`, user.User_id)
	if err != nil {
		return []util.Notification{}, errors.New("error")
	}
	for rows.Next() {
		rows.Scan(&id, &message, &date)
		formatedDate := getFormatedDate(date)
		myNotification = append(myNotification, util.Notification{Id: id, Message: message, Date: formatedDate})
	}
	return myNotification, nil
}

func DeleteNotification(id string) error {
	db := DBInit()
	_, err := db.Exec(`DELETE FROM Alert WHERE alert_id=$1`, id)
	if err != nil {
		return errors.New("forbidden")
	}
	return nil
}

func getFormatedDate(date string) string {
	timeLabel := []string{"An", "Mois", "Jour", "Heure", "Minute", "Seconde"}
	for index, value := range strings.Split(date, "-") {
		if value != "00" {
			time, _ := strconv.Atoi(value)
			return "Il y a " + strconv.Itoa(time) + " " + timeLabel[index]
		}
	}
	return "Il y a 1 seconds"
}
