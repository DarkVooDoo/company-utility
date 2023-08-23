package model

import (
	"errors"
	"log"
	util "work/util"
)

func CreateShift(planning []util.ShiftStruct) error {
	var db = DBInit()
	for _, user := range planning {
		for _, date := range user.Shift_date {
			_, err := db.Exec("INSERT INTO Shift (shift_date, shift_start, shift_end, shift_pause, shift_user_id, shift_company_id) VALUES($1,$2,$3,$4,$5,$6)", date, user.Shift_start, user.Shift_end, user.Shift_pause, user.User_id, user.Company_id)
			if err != nil {
				return err
			}
		}
		db.Exec(`INSERT INTO Alert (alert_message, alert_user_id) VALUES('Votre planning a changé', $1)`, user.User_id)
	}
	return nil
}

func GetUserShift(userToken string, companyId string, from string, to string) (util.ShiftResponse, error) {
	user, errToken := VerifyToken(userToken)
	if errToken != nil {
		return util.ShiftResponse{}, errors.New("token error")
	}
	var db = DBInit()
	var uId, shiftId, name, start, end, role string
	var day, month, pause uint16
	var shift []util.ShiftStruct
	member := db.QueryRow(`SELECT member_role FROM Member WHERE member_user_id=$1`, user.User_id)
	member.Scan(&role)
	rows, err := db.Query(`SELECT user_id, CONCAT(user_firstname, ' ', user_lastname) as user_name, shift_id, shift_start, shift_end, 
	shift_pause, DATE_PART('day', shift_date) shift_day, DATE_PART('month', shift_date) shift_month 
	FROM Company LEFT JOIN member ON member_company_id=company_id LEFT JOIN Users ON user_id=member_user_id LEFT JOIN Shift ON shift_user_id=member_user_id WHERE shift_date >= $1 AND shift_date < $2 AND company_id=$3 ORDER BY shift_date ASC`, from, to, companyId)
	if err != nil {
		log.Println(err)
		return util.ShiftResponse{}, errors.New("error fetching")
	}
	for rows.Next() {
		rows.Scan(&uId, &name, &shiftId, &start, &end, &pause, &day, &month)
		shift = append(shift, util.ShiftStruct{User_id: uId, User_name: name, Shift_id: shiftId, Shift_start: start, Shift_end: end, Shift_pause: pause, Shift_day: day, Shift_month: month})
	}
	if len(shift) > 0 {
		return util.ShiftResponse{Role: role, Shift: shift}, nil
	} else {
		return util.ShiftResponse{}, errors.New("not shift")
	}
}

func ModifyShift(newShift []util.ModifyShiftStruct) error {
	log.Println(newShift)
	db := DBInit()
	for _, shift := range newShift {
		_, err := db.Exec(`UPDATE Shift SET shift_start=$1, shift_end=$2, shift_pause=$3 WHERE shift_id=$4`, shift.Start, shift.End, shift.Pause, shift.Id)
		if err != nil {
			return errors.New("error")
		}
	}
	return nil
}

func DeleteShift(id string) error {
	db := DBInit()
	_, err := db.Exec(`DELETE FROM Shift WHERE shift_id=$1`, id)
	if err != nil {
		return errors.New("error")
	}
	return nil
}

func GetDayShift(userToken string, companyId string, date string) (util.TodayShift, error) {
	var start, end string
	var pause uint16
	user, tokenErr := VerifyToken(userToken)
	if tokenErr != nil {
		return util.TodayShift{}, errors.New("error")
	}
	db := DBInit()
	row := db.QueryRow(`SELECT shift_start, shift_end, shift_pause FROM Member LEFT JOIN Shift ON member_user_id=shift_user_id AND member_company_id=shift_company_id WHERE member_user_id=$1 AND member_company_id=$2 AND shift_date=$3`, user.User_id, companyId, date)
	err := row.Scan(&start, &end, &pause)
	if err != nil {
		return util.TodayShift{}, errors.New("error")
	}
	return util.TodayShift{Start: start, End: end, Pause: pause}, nil
}
