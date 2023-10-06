package model

import (
	"encoding/json"
	"errors"
	"log"
	"work/store"
	"work/util"
)

func GetMembers(companyId string) ([]util.Member, error) {
	db := store.DBInit()
	var mId, mName, mRole, userId string
	var members []util.Member = []util.Member{}
	member, errMember := db.Query(`SELECT member_id, CONCAT(user_firstname, ' ', user_lastname), member_role, member_user_id FROM member LEFT JOIN Users ON user_id=member_user_id WHERE member_company_id=$1`, companyId)
	if errMember != nil {
		return []util.Member{}, errors.New("error")
	}
	for member.Next() {
		member.Scan(&mId, &mName, &mRole, &userId)
		members = append(members, util.Member{Id: mId, Name: mName, Role: mRole, UserId: userId})
	}

	return members, nil
}

func ChangeMemberRole(member util.Role) error {
	db := store.DBInit()
	_, err := db.Exec(`UPDATE Member SET member_role=$1 WHERE member_id=$2`, member.Role, member.Id)
	if err != nil {
		log.Println(err)
		return errors.New("error")
	}
	return nil
}

func AddNewMember(userId string, member util.NewMember) ([]byte, error) {
	var role, newUserId, newUserRole, newUserName, newMemberId string
	db := store.DBInit()
	result := db.QueryRow(`SELECT member_role FROM Member WHERE member_user_id=$1 AND member_company_id=$2`, userId, member.CompanyId)
	if scanErr := result.Scan(&role); scanErr != nil {
		return nil, errors.New("error")
	}
	if role == "Boss" || role == "Admin" {
		result := db.QueryRow(`SELECT user_id, CONCAT(user_firstname, ' ', user_lastname) FROM Users WHERE user_email=$1`, member.Email)
		if userError := result.Scan(&newUserId, &newUserName); userError != nil {
			return nil, errors.New("error")
		}
		row := db.QueryRow(`INSERT INTO Member (member_role, member_worth, member_user_id, member_company_id) VALUES($1,$2,$3,$4) RETURNING member_role, member_id`, member.Role, member.Worth, newUserId, member.CompanyId)
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
	db := store.DBInit()
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
