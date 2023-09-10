package model

import (
	"encoding/json"
	"errors"
	"log"
	"strconv"
	"work/db"
	"work/util"
)

func GetCurrentShift(userId string, companyId string) ([]byte, error) {
	var id, state, hourId string
	db := db.DBInit()
	row := db.QueryRow(`SELECT tracker_id, tracker_state, hour_id FROM Tracker LEFT JOIN Hour ON tracker_id=hour_tracker_id WHERE tracker_state=$1 OR hour_end IS NULL OR tracker_state=$2 AND tracker_user_id=$3 AND tracker_company_id=$4`, "En Cours", "En Pause", userId, companyId)
	if err := row.Scan(&id, &state, &hourId); err != nil {
		return []byte(""), errors.New("error")
	}
	shift := util.CurrentShiftStatus{Id: id, State: state, HourId: hourId}
	body, _ := json.Marshal(shift)
	return body, nil
}

func UpdateCurrentShift(userId string, shift util.UpdateCurrentShift) error {
	var trackId string
	tx, _ := db.DBInit().Begin()
	if shift.Shift != "" {
		if shift.State == "En Pause" {
			tx.Exec(`UPDATE Tracker SET tracker_state=$1 WHERE tracker_id=$2`, "En Cours", shift.Shift)
			tx.Exec(`INSERT INTO Hour (hour_start, hour_tracker_id) VALUES(NOW(),$1)`, shift.Shift)
			tx.Commit()
			return nil
		}
		_, err := tx.Exec(`UPDATE Hour SET hour_end=NOW() WHERE hour_id=$1`, shift.Hour)
		if err != nil {
			log.Println(err)
			return tx.Rollback()
		}
		tx.Exec(`UPDATE Tracker SET tracker_state=$1 WHERE tracker_id=$2`, "Finis", shift.Shift)
		tx.Commit()
		return nil
	}
	track := tx.QueryRow(`INSERT INTO Tracker (tracker_state, tracker_company_id, tracker_user_id) VALUES($1,$2,$3) RETURNING tracker_id`, "En Cours", shift.Company, userId)
	if err := track.Scan(&trackId); err != nil {
		return tx.Rollback()
	}
	tx.Exec(`INSERT INTO Hour (hour_start, hour_tracker_id) VALUES(NOW(),$1)`, trackId)
	tx.Commit()
	return nil
}

func PauseCurrentShift(userId string, shift util.UpdateCurrentShift) error {
	tx, _ := db.DBInit().Begin()
	_, err := tx.Exec(`UPDATE Hour SET hour_end=NOW() WHERE hour_id=$1`, shift.Hour)
	if err != nil {
		return tx.Rollback()
	}
	tx.Exec(`UPDATE Tracker SET tracker_state=$1 WHERE tracker_id=$2`, "En Pause", shift.Shift)
	tx.Commit()
	return nil
}

func GetCompanyUserHours(companyId string) ([]byte, error) {
	db := db.DBInit()
	var day string
	var second float32
	var eliminateDoublon map[string]util.Hour = map[string]util.Hour{}
	var hour []util.Hour = []util.Hour{}
	hours, err := db.Query(`SELECT TO_CHAR(hour_start, 'DD-MM'), EXTRACT(EPOCH FROM AGE(hour_end, hour_start)) FROM Tracker RIGHT JOIN Hour 
	ON hour_tracker_id=tracker_id WHERE tracker_state='Finis' AND tracker_company_id=$1`, companyId)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error")
	}
	for hours.Next() {
		hours.Scan(&day, &second)
		eliminateDoublon[day] = util.Hour{Day: day, Seconds: eliminateDoublon[day].Seconds + uint(second)}
	}
	for _, value := range eliminateDoublon {
		value.Hours = SecondsFormatted(value.Seconds)
		hour = append(hour, value)
	}
	body, _ := json.Marshal(hour)
	return body, nil

}

func SecondsFormatted(seconds uint) string {
	if seconds < 60 {
		return strconv.Itoa(int(seconds)) + " Secondes"
	} else if seconds > 59 && seconds < 60*60 {
		return strconv.Itoa(int(seconds)/60) + " Minutes et " + strconv.Itoa(int(seconds)%60) + " Secondes"
	} else {
		return strconv.Itoa(int(seconds)/(60*60)) + " Heure et " + strconv.Itoa(int(seconds)%(60*60)/60) + " Minutes et " + strconv.Itoa(int(seconds)%(60*60)%60) + " Secondes"
	}
}
