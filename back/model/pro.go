package model

import (
	"errors"
	"log"
	"work/store"
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

func CreateCompany(company util.CreateCompany, userId string) error {
	db := store.DBInit()
	tx, _ := db.Begin()
	result := tx.QueryRow(`INSERT INTO Company (company_name, company_adresse, company_postal, company_user_id) VALUES($1,$2,$3,$4) RETURNING company_id`, company.Name, company.Adresse, company.Postal, userId)
	var companyId string
	scanError := result.Scan(&companyId)
	_, err := tx.Exec(`INSERT INTO Member (member_role, member_user_id, member_company_id) VALUES ($1, $2, $3)`, "Boss", userId, companyId)
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
	db := store.DBInit()
	var myCompany []util.Company = []util.Company{}
	var id, name, adresse string
	var postal uint
	if requestType == "Profile" {
		company, err := db.Query(`SELECT company_id, company_name, company_adresse, company_postal FROM Company WHERE company_user_id=$1`, user.User_id)
		if err != nil {
			// log.Println(err)
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
			// log.Println(err)
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

	db := store.DBInit()
	result := db.QueryRow(`SELECT company_id, company_name, company_adresse, company_postal FROM Company WHERE company_id=$1 AND company_user_id=$2`, companyId, user.User_id)
	pendingHolydays, pendingErr := GetHolydayByStatus(companyId, "En Attente")
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
	var db = store.DBInit()
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

func GetCompanySetting(companyId string) (util.UpdateCompany, error) {
	var setting util.UpdateCompany
	db := store.DBInit()
	company := db.QueryRow(`SELECT company_id, company_adresse, company_postal, COALESCE(company_urssaf, ''), COALESCE(company_ape, ''), COALESCE(company_siret, '') FROM Company WHERE company_id=$1`, companyId)
	if err := company.Scan(&setting.Id, &setting.Adresse, &setting.Postal, &setting.Urssaf, &setting.Ape, &setting.Siret); err != nil {
		log.Println(err)
		return util.UpdateCompany{}, errors.New("error")
	}
	return setting, nil
}

func UpdateCompany(company util.UpdateCompany) error {
	db := store.DBInit()
	_, err := db.Exec(`UPDATE Company SET company_adresse=$1, company_postal=$2, company_urssaf=$3, company_siret=$4, company_ape=$5 WHERE company_id=$6`, company.Adresse, company.Postal, company.Urssaf, company.Siret, company.Ape, company.Id)
	if err != nil {
		log.Println("error")
		return errors.New("error")
	}
	return nil
}

func DeleteCompany(id string) error {
	db := store.DBInit()
	_, err := db.Exec(`DELETE FROM Company WHERE company_id=$1`, id)
	if err != nil {
		return errors.New("error")
	}
	return nil
}
