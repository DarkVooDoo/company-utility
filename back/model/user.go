package model

import (
	"database/sql"
	"errors"
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
	var id, name string
	row = db.QueryRow(`SELECT user_id, CONCAT(user_firstname, ' ', user_lastname) as user_name FROM Users WHERE user_email=$1 AND user_password=$2`, conn.Email, conn.Password)
	row.Scan(&id, &name)

	if id != "" {
		tokenPayload := util.JWTokenInterface{
			User: util.UserJWT{User_id: id, User_Name: name},
			RegisteredClaims: jwt.RegisteredClaims{
				// A usual scenario is to set the expiration time relative to the current time
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(Token_Duration)),
				Issuer:    "test",
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenPayload)
		tkt, _ := token.SignedString([]byte("my-private-key"))
		user := util.ReturnedTokenStruct{
			User_photo: "photo url",
			User_name:  name,
			User_id:    id,
			Token:      tkt,
		}
		return user, nil
	}
	return util.ReturnedTokenStruct{}, nil
}

func VerifyToken(token string) (util.ReturnedTokenStruct, error) {
	tkt, _ := jwt.ParseWithClaims(token, &util.JWTokenInterface{}, func(t *jwt.Token) (interface{}, error) {
		return []byte("my-private-key"), nil
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
		tkt, _ := token.SignedString([]byte("my-private-key"))
		return util.ReturnedTokenStruct{User_id: claim.User.User_id, User_name: claim.User.User_Name, User_photo: "", Token: tkt}, nil
	} else {
		return util.ReturnedTokenStruct{}, errors.New("unathorized")
	}
}

func CreateUser(newAccount util.CreateUserStruct) error {
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
	row := db.QueryRow(`SELECT user_id, TO_CHAR(user_joined, 'Month-YYYY'), user_lastname, user_firstname, user_email, user_adresse, user_postal FROM Users WHERE user_id=$1`, user.User_id)
	row.Scan(&id, &joined, &lastname, &firstname, &email, &adresse, &postal)
	return util.UserProfile{Id: id, Joined: joined, Firstname: firstname, Lastname: lastname, Adresse: adresse, Postal: postal, Email: email}, nil
}

func ModifyProfile(profile util.UserProfile) error {
	db := DBInit()
	_, err := db.Exec(`UPDATE Users SET user_firstname=$1, user_lastname=$2, user_adresse=$3, user_postal=$4 WHERE user_id=$5`, profile.Firstname, profile.Lastname, profile.Adresse, profile.Postal, profile.Id)
	if err != nil {
		return errors.New("error happends")
	}
	return nil
}
