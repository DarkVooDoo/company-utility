package model

import (
	"errors"
	"log"
	"work/db"
	"work/util"
)

type ProInterface interface {
	CreateCompany(company util.CreateCompany, userToken string) error
	GetEntreprises(userToken string, requestType string) ([]util.Company, error)
	GetSingleEntreprise(companyId string, userToken string) (util.Company, error)
	CompanyEmployee(companyId string) ([]util.CompanyUser, error)
}

type Pro struct {
	ProInterface
}

func CreateCompany(company util.CreateCompany, userToken string) error {
	user, tokenError := VerifyToken(userToken)
	if tokenError != nil {
		return errors.New("token error")
	}
	db := db.DBInit()
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
	user, err := IsTokenValid(userToken)
	if err != nil {
		return []util.Company{}, errors.New("error token")
	}
	db := db.DBInit()
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

	user, err := IsTokenValid(userToken)
	if err != nil {
		return util.Company{}, errors.New("error")
	}

	db := db.DBInit()
	result := db.QueryRow(`SELECT company_id, company_name, company_adresse, company_postal FROM Company WHERE company_id=$1 AND company_user_id=$2`, companyId, user.User_id)
	pendingHolydays, pendingErr := GetPendingHolydays(companyId)
	role := GetUserRole(user.User_id, companyId)
	var id, name, adresse string
	var postal uint
	errCompany := result.Scan(&id, &name, &adresse, &postal)
	if errCompany != nil || pendingErr != nil {
		return util.Company{}, errors.New("not company")
	}

	return util.Company{Id: id, Name: name, Adresse: adresse, Postal: postal, Role: role, HolydayPending: pendingHolydays}, nil
}

func CompanyEmployee(companyId string) ([]util.CompanyUser, error) {
	var db = db.DBInit()
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
