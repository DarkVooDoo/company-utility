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
	var salary float64
	tx, _ := db.DBInit().Begin()
	row := tx.QueryRow(`SELECT member_worth FROM Member WHERE member_user_id=$1 AND member_company_id=$2`, userId, shift.Company)
	if err := row.Scan(&salary); err != nil {
		return errors.New("error")
	}
	if shift.Shift != "" {
		if shift.State == "En Pause" {
			tx.Exec(`UPDATE Tracker SET tracker_state=$1 WHERE tracker_id=$2`, "En Cours", shift.Shift)
			tx.Exec(`INSERT INTO Hour (hour_start, hour_worth, hour_tracker_id) VALUES(NOW(),$1)`, salary, shift.Shift)
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
	tx.Exec(`INSERT INTO Hour (hour_start, hour_worth, hour_tracker_id) VALUES(NOW(),$1, $2)`, salary, trackId)
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

func GetDayByDayHours(companyId string) ([]byte, error) {
	db := db.DBInit()
	var name, day string
	var second float32
	var eliminateDoublon map[string]util.Hour = map[string]util.Hour{}
	var hour []util.Hour = []util.Hour{}
	hours, err := db.Query(`SELECT CONCAT(user_firstname, ' ', user_lastname), TO_CHAR(hour_start, 'DD-MM'), EXTRACT(EPOCH FROM AGE(hour_end, hour_start)) FROM Tracker RIGHT JOIN Hour 
	ON hour_tracker_id=tracker_id RIGHT JOIN Users ON user_id=tracker_user_id WHERE tracker_state='Finis' AND tracker_company_id=$1`, companyId)
	if err != nil {
		log.Println(err)
		return nil, errors.New("error")
	}
	for hours.Next() {
		hours.Scan(&name, &day, &second)
		eliminateDoublon[day] = util.Hour{Name: name, Day: day, Seconds: eliminateDoublon[day].Seconds + uint(second)}
	}
	for _, value := range eliminateDoublon {
		value.Hours = SecondsFormatted(value.Seconds)
		hour = append(hour, value)
	}
	body, _ := json.Marshal(hour)
	return body, nil
}

type AccumulateHours struct {
	Name    string  `json:"name"`
	Seconds uint    `json:"seconds"`
	Total   string  `json:"total"`
	Salary  float64 `json:"salary"`
}

func GetAccumulateHours(companyId string, from string, to string) ([]byte, error) {
	var id, name string
	var seconds, worth float64
	var sumHours map[string]AccumulateHours = map[string]AccumulateHours{}
	var payrolls []AccumulateHours = []AccumulateHours{}
	db := db.DBInit()
	employees, err := db.Query(`SELECT user_id, CONCAT(user_firstname, ' ', user_lastname), EXTRACT(EPOCH FROM AGE(hour_end, hour_start)), hour_worth FROM Tracker RIGHT JOIN Hour 
	ON hour_tracker_id=tracker_id RIGHT JOIN Users ON user_id=tracker_user_id WHERE tracker_state='Finis' AND tracker_company_id=$1 AND hour_start BETWEEN $2 AND $3`, companyId, from, to+" 23:59:55")
	if err != nil {
		return nil, errors.New("error")
	}
	for employees.Next() {
		employees.Scan(&id, &name, &seconds, &worth)
		sumHours[id] = AccumulateHours{
			Name:    name,
			Seconds: uint(seconds) + sumHours[id].Seconds,
			Total:   SecondsFormatted(uint(seconds) + sumHours[id].Seconds),
			Salary:  util.RoundFloat((worth/(60*60))*(float64(seconds)+float64(sumHours[id].Seconds)), 2),
		}
	}
	for _, value := range sumHours {
		payrolls = append(payrolls, value)
	}
	body, _ := json.Marshal(payrolls)
	return body, nil
}

func SecondsFormatted(seconds uint) string {
	// strconv.Itoa(int(seconds)%60)
	if seconds < 60 {
		return strconv.Itoa(int(seconds)) + " Secondes"
	} else if seconds > 59 && seconds < 60*60 {
		return "0H" + strconv.Itoa(int(seconds)/60)
	} else {
		return strconv.Itoa(int(seconds)/(60*60)) + "H" + strconv.Itoa(int(seconds)%(60*60)/60)
	}
}
