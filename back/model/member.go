package model

import (
	"errors"
	"work/util"
)

func AddNewMember(member util.NewMember, userToken string) (util.Member, error) {
	var role, newUserId, newUserRole, newUserName, newMemberId string
	user, err := VerifyToken(userToken)
	if err != nil {
		return util.Member{}, errors.New("token error")
	}
	db := DBInit()
	result := db.QueryRow(`SELECT member_role FROM Member WHERE member_user_id=$1 AND member_company_id=$2`, user.User_id, member.CompanyId)
	if scanErr := result.Scan(&role); scanErr != nil {
		return util.Member{}, errors.New("member select error")
	}
	if role == "Boss" || role == "Admin" {
		result := db.QueryRow(`SELECT user_id, CONCAT(user_firstname, ' ', user_lastname) FROM Users WHERE user_email=$1`, member.Email)
		if userError := result.Scan(&newUserId, &newUserName); userError != nil {
			return util.Member{}, errors.New("email error")
		}
		row := db.QueryRow(`INSERT INTO Member (member_role, member_user_id, member_company_id) VALUES($1,$2,$3) RETURNING member_role, member_id`, member.Role, newUserId, member.CompanyId)
		if err := row.Scan(&newUserRole, &newMemberId); err != nil {
			return util.Member{}, errors.New("insert error")
		}
		return util.Member{Id: newMemberId, Name: newUserName, Role: newUserRole}, nil

	}
	return util.Member{}, errors.New("last")
}

func DeleteMember(member util.DeleteMember, token string) error {
	var role string
	user, err := VerifyToken(token)
	if err != nil {
		return errors.New("token error")
	}
	db := DBInit()
	userMakingTheRequest := db.QueryRow(`SELECT member_role FROM Member WHERE member_user_id=$1`, user.User_id)
	if scanErro := userMakingTheRequest.Scan(&role); scanErro != nil {
		return errors.New("user making the request error")
	}
	if role == "Boss" || role == "Admin" {
		_, err := db.Exec(`DELETE FROM Member WHERE member_id=$1 AND member_company_id=$2`, member.Id, member.CompanyId)
		if err != nil {
			return errors.New("error deleting member")
		}
		return nil
	}
	return errors.New("doesnt have permission")
}
