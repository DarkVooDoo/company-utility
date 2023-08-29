package model

import (
	"database/sql"
	"errors"
	"os"
	"strings"
	"time"
	"work/util"

	"github.com/golang-jwt/jwt/v5"
)

const (
	Token_Duration = (24 * 3) * time.Hour
)

func SignInUser(conn util.SignUserPayloadStruct) (util.ReturnedTokenStruct, error) {
	var db = DBInit()
	var row *sql.Row
	var id, name, password string
	row = db.QueryRow(`SELECT user_id, CONCAT(user_firstname, ' ', LEFT(user_lastname, 1), '.') as user_name, user_password FROM Users WHERE user_email=$1 AND user_password=$2`, conn.Email, conn.Password)

	if err := row.Scan(&id, &name, &password); id != "" || err == nil {
		tokenPayload := util.JWTokenInterface{
			User: util.UserJWT{User_id: id, User_Name: name},
			RegisteredClaims: jwt.RegisteredClaims{
				// A usual scenario is to set the expiration time relative to the current time
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(Token_Duration)),
				Issuer:    "test",
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenPayload)
		tkt, _ := token.SignedString([]byte(os.Getenv("jwt_key")))
		user := util.ReturnedTokenStruct{
			User_photo: "photo url",
			User_name:  name,
			User_id:    id,
			Token:      tkt,
		}
		return user, nil
	}
	return util.ReturnedTokenStruct{}, errors.New("error")
}

func VerifyToken(token string) (util.ReturnedTokenStruct, error) {
	tkt, _ := jwt.ParseWithClaims(token, &util.JWTokenInterface{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("jwt_key")), nil
	})
	if tkt.Valid {
		claim, _ := tkt.Claims.(*util.JWTokenInterface)
		tokenPayload := util.JWTokenInterface{
			User: util.UserJWT{User_id: claim.User.User_id, User_Name: claim.User.User_Name},
			RegisteredClaims: jwt.RegisteredClaims{
				// A usual scenario is to set the expiration time relative to the current time
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(Token_Duration)),
				Issuer:    "test",
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenPayload)
		tkt, _ := token.SignedString([]byte(os.Getenv("jwt_key")))
		return util.ReturnedTokenStruct{User_id: claim.User.User_id, User_name: claim.User.User_Name, User_photo: "", Token: tkt}, nil
	} else {
		return util.ReturnedTokenStruct{}, errors.New("unathorized")
	}
}

func CreateUser(newAccount util.CreateUserStruct) error {
	newAccount.Firstname = strings.ToUpper(newAccount.Firstname[0:1]) + newAccount.Firstname[1:]
	newAccount.Lastname = strings.ToUpper(newAccount.Lastname[0:1]) + newAccount.Lastname[1:]
	db := DBInit()
	result, err := db.Exec(`INSERT INTO Users (user_email, user_lastname, user_firstname, user_password) VALUES($1,$2,$3,$4)`, newAccount.Email, newAccount.Lastname, newAccount.Firstname, newAccount.Password)
	affected, _ := result.RowsAffected()
	if err != nil && affected == 0 {
		return errors.New("error happends")
	}
	return nil
}

func GetUserProfile(userToken string) (util.UserProfile, error) {
	user, err := VerifyToken(userToken)
	if err != nil {
		return util.UserProfile{}, errors.New("error")
	}
	db := DBInit()
	var id, firstname, lastname, adresse, postal, email, joined string
	row := db.QueryRow(`SELECT user_id, TO_CHAR(user_joined, 'TMMonth-YYYY'), user_lastname, user_firstname, user_email, user_adresse, user_postal FROM Users WHERE user_id=$1`, user.User_id)
	row.Scan(&id, &joined, &lastname, &firstname, &email, &adresse, &postal)
	return util.UserProfile{Id: id, Joined: joined, Firstname: firstname, Lastname: lastname, Adresse: adresse, Postal: postal, Email: email}, nil
}

func ModifyProfile(profile util.UserProfile, userToken string) (util.UserProfile, error) {
	var id, firstname, lastname, adresse, postal, email, joined string
	user, tokenErr := VerifyToken(userToken)
	if tokenErr != nil {
		return util.UserProfile{}, errors.New("error")
	}
	db := DBInit()
	row := db.QueryRow(`UPDATE Users SET user_firstname=$1, user_lastname=$2, user_adresse=$3, user_postal=$4 WHERE user_id=$5 
	RETURNING user_id, TO_CHAR(user_joined, 'Month-YYYY'), user_lastname, user_firstname, user_email, user_adresse, user_postal`, profile.Firstname, profile.Lastname, profile.Adresse, profile.Postal, user.User_id)
	if err := row.Scan(&id, &joined, &lastname, &firstname, &email, &adresse, &postal); err != nil {
		return util.UserProfile{}, errors.New("error happends")
	}
	return util.UserProfile{Id: id, Joined: joined, Firstname: firstname, Lastname: lastname, Adresse: adresse, Postal: postal, Email: email}, nil
}
