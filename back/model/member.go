package model

import (
	"encoding/json"
	"errors"
	"work/db"
	"work/util"
)

type Member interface {
	AddNewMember()
	DeleteMember()
}

func AddNewMember(userId string, member util.NewMember) ([]byte, error) {
	var role, newUserId, newUserRole, newUserName, newMemberId string
	db := db.DBInit()
	result := db.QueryRow(`SELECT member_role FROM Member WHERE member_user_id=$1 AND member_company_id=$2`, userId, member.CompanyId)
	if scanErr := result.Scan(&role); scanErr != nil {
		return nil, errors.New("error")
	}
	if role == "Boss" || role == "Admin" {
		result := db.QueryRow(`SELECT user_id, CONCAT(user_firstname, ' ', user_lastname) FROM Users WHERE user_email=$1`, member.Email)
		if userError := result.Scan(&newUserId, &newUserName); userError != nil {
			return nil, errors.New("error")
		}
		row := db.QueryRow(`INSERT INTO Member (member_role, member_user_id, member_company_id) VALUES($1,$2,$3) RETURNING member_role, member_id`, member.Role, newUserId, member.CompanyId)
		if err := row.Scan(&newUserRole, &newMemberId); err != nil {
			return nil, errors.New("error")
		}
		body, _ := json.Marshal(util.Member{Id: newMemberId, Name: newUserName, Role: newUserRole})
		return body, nil
	}
	return nil, errors.New("error")
}

func DeleteMember(userId string, member util.DeleteMember) error {
	var role string
	db := db.DBInit()
	userMakingTheRequest := db.QueryRow(`SELECT member_role FROM Member WHERE member_user_id=$1`, userId)
	if scanErro := userMakingTheRequest.Scan(&role); scanErro != nil {
		return errors.New("err")
	}
	if role == "Boss" || role == "Admin" {
		_, err := db.Exec(`DELETE FROM Member WHERE member_id=$1 AND member_company_id=$2`, member.Id, member.CompanyId)
		if err != nil {
			return errors.New("err")
		}
		return nil
	}
	return errors.New("err")
}
