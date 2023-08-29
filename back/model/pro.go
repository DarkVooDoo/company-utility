package model

import (
	"errors"
	"log"
	"work/util"
)

func CreateCompany(company util.CreateCompany, userToken string) error {
	user, tokenError := VerifyToken(userToken)
	if tokenError != nil {
		return errors.New("token error")
	}
	db := DBInit()
	tx, _ := db.Begin()
	result := tx.QueryRow(`INSERT INTO Company (company_name, company_adresse, company_postal, company_user_id) VALUES($1,$2,$3,$4) RETURNING company_id`, company.Name, company.Adresse, company.Postal, user.User_id)
	var companyId string
	scanError := result.Scan(&companyId)
	_, err := tx.Exec(`INSERT INTO Member (member_role, member_user_id, member_company_id) VALUES ($1, $2, $3)`, "Boss", user.User_id, companyId)
	if err != nil || scanError != nil {
		tx.Rollback()
		return errors.New("error creating company")
	}
	return tx.Commit()
}

func GetEntreprises(userToken string, requestType string) ([]util.Company, error) {
	user, tokenError := VerifyToken(userToken)
	if tokenError != nil {
		return []util.Company{}, errors.New("error token")
	}
	db := DBInit()
	var myCompany []util.Company = []util.Company{}
	var id, name, adresse string
	var postal uint
	if requestType == "Profile" {
		company, err := db.Query(`SELECT company_id, company_name, company_adresse, company_postal FROM Company WHERE company_user_id=$1`, user.User_id)
		if err != nil {
			log.Println(err)
			return myCompany, errors.New("error")
		} else {
			for company.Next() {
				company.Scan(&id, &name, &adresse, &postal)
				myCompany = append(myCompany, util.Company{Id: id, Name: name, Adresse: adresse, Postal: postal})
			}
			return myCompany, nil
		}
	} else {
		company, err := db.Query(`SELECT company_id, company_name, company_adresse, company_postal FROM Member LEFT JOIN Company ON member_company_id=company_id WHERE member_user_id=$1`, user.User_id)
		if err != nil {
			log.Println(err)
			return myCompany, errors.New("error")
		} else {
			for company.Next() {
				company.Scan(&id, &name, &adresse, &postal)
				myCompany = append(myCompany, util.Company{Id: id, Name: name, Adresse: adresse, Postal: postal})
			}
			return myCompany, nil
		}

	}
}

func GetSingleEntreprise(companyId string, userToken string) (util.Company, error) {

	var members []util.Member = []util.Member{}
	user, err := VerifyToken(userToken)
	if err != nil {
		return util.Company{}, errors.New("error")
	}
	db := DBInit()
	result := db.QueryRow(`SELECT company_id, company_name, company_adresse, company_postal FROM Company WHERE company_id=$1 AND company_user_id=$2`, companyId, user.User_id)
	member, errMember := db.Query(`SELECT member_id, user_firstname, member_role FROM member LEFT JOIN Users ON user_id=member_user_id WHERE member_company_id=$1`, companyId)
	pendingHolydays, pendingErr := GetPendingHolydays(companyId)
	log.Println(pendingHolydays)
	var id, name, adresse, mId, mName, mRole string
	var postal uint
	errCompany := result.Scan(&id, &name, &adresse, &postal)
	if errCompany != nil || errMember != nil || pendingErr != nil {
		return util.Company{}, errors.New("not company")
	}
	for member.Next() {
		member.Scan(&mId, &mName, &mRole)
		members = append(members, util.Member{Id: mId, Name: mName, Role: mRole})
	}
	return util.Company{Id: id, Name: name, Adresse: adresse, Postal: postal, HolydayPending: pendingHolydays, Members: members}, nil
}

func CompanyEmployee(companyId string) ([]util.CompanyUser, error) {
	var db = DBInit()
	var companyUser []util.CompanyUser
	var name, role, id string
	result, err := db.Query(`SELECT CONCAT(user_firstname,' ', user_lastname), member_role, user_id FROM Member LEFT JOIN Users ON user_id=member_user_id WHERE member_company_id=$1`, companyId)
	// userShifs, shiftError := db.Query(`SELECT user_lastname FROM Shift WHERE shift_user_id=$1 AND shift_company_id=$2`, userId, companyId)
	if err != nil {
		return companyUser, errors.New("error fetching data")
	}
	for result.Next() {
		result.Scan(&name, &role, &id)
		companyUser = append(companyUser, util.CompanyUser{User_id: id, User_name: name, User_role: role})
	}
	return companyUser, nil
}
