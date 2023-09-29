package model

import (
	"errors"
	"log"
	"work/db"
	util "work/util"
)

func CreateShift(planning []util.CreateShift, company string) error {
	log.Println("enter")
	var db = db.DBInit()
	tx, _ := db.Begin()
	for _, user := range planning {
		for _, date := range user.Shift_date {
			_, err := tx.Exec("INSERT INTO Shift (shift_date, shift_start, shift_end, shift_pause, shift_user_id, shift_company_id) VALUES($1,$2,$3,$4,$5,$6)", date, user.Shift_start, user.Shift_end, user.Shift_pause, user.User_id, company)
			if err != nil {
				tx.Rollback()
				return err
			}
		}
		_, err := tx.Exec(`INSERT INTO Alert (alert_message, alert_user_id) VALUES('Votre planning a changé', $1)`, user.User_id)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	log.Println("Added")
	tx.Commit()
	return nil
}

func GetUserShift(userId string, companyId string, from string, to string) (util.ShiftResponse, error) {
	var db = db.DBInit()
	var uId, shiftId, date, name, start, end string
	var day, month, pause uint16
	var shift []util.ShiftStruct = []util.ShiftStruct{}
	rows, err := db.Query(`SELECT user_id, CONCAT(user_firstname, ' ', user_lastname) as user_name, shift_id, shift_date, shift_start, shift_end, 
	shift_pause, DATE_PART('day', shift_date) shift_day, DATE_PART('month', shift_date) shift_month 
	FROM Shift LEFT JOIN Users ON user_id=shift_user_id WHERE shift_date >= $1 AND shift_date < $2 AND shift_company_id=$3 ORDER BY shift_date ASC`, from, to, companyId)
	role := GetUserRole(userId, companyId)
	if err != nil {
		log.Println(err)
		return util.ShiftResponse{}, errors.New("error fetching")
	}
	for rows.Next() {
		rows.Scan(&uId, &name, &shiftId, &date, &start, &end, &pause, &day, &month)
		shift = append(shift, util.ShiftStruct{User_id: uId, User_name: name, Shift_id: shiftId, Shift_date: date, Shift_start: start, Shift_end: end, Shift_pause: pause, Shift_day: day, Shift_month: month})
	}
	return util.ShiftResponse{Role: role, Shift: shift}, nil
}

func ModifyShift(newShift []util.ModifyShiftStruct) error {
	db := db.DBInit()
	for _, shift := range newShift {
		_, err := db.Exec(`UPDATE Shift SET shift_start=$1, shift_end=$2, shift_pause=$3 WHERE shift_id=$4`, shift.Start, shift.End, shift.Pause, shift.Id)
		if err != nil {
			return errors.New("error")
		}
	}
	return nil
}

func DeleteShift(id string) error {
	db := db.DBInit()
	_, err := db.Exec(`DELETE FROM Shift WHERE shift_id=$1`, id)
	if err != nil {
		return errors.New("error")
	}
	return nil
}

func GetDayShift(id string, companyId string, date string) (util.TodayShift, error) {
	var start, end string
	var pause uint16
	db := db.DBInit()
	row := db.QueryRow(`SELECT shift_start, shift_end, shift_pause FROM Member LEFT JOIN Shift ON member_user_id=shift_user_id AND member_company_id=shift_company_id WHERE member_user_id=$1 AND member_company_id=$2 AND shift_date=$3`, id, companyId, date)
	err := row.Scan(&start, &end, &pause)
	if err != nil {
		return util.TodayShift{}, errors.New("error")
	}
	return util.TodayShift{Start: start, End: end, Pause: pause}, nil
}
