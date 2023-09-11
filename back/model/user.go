package model

import (
	"database/sql"
	"errors"
	"log"
	"os"
	"strings"
	"time"
	"work/db"
	"work/util"

	"github.com/golang-jwt/jwt/v5"
)

const (
	Token_Duration         = 5 * time.Hour
	Refresh_Token_Duration = (24 * 10) * time.Hour
)

func SignInUser(conn util.SignUserPayloadStruct) (util.ReturnedTokenStruct, error) {
	var db = db.DBInit()
	var row *sql.Row
	var id, name, password string
	row = db.QueryRow(`SELECT user_id, CONCAT(user_firstname, ' ', LEFT(user_lastname, 1), '.') as user_name, user_password FROM Users WHERE user_email=$1 AND user_password=$2`, conn.Email, conn.Password)

	if err := row.Scan(&id, &name, &password); id != "" || err == nil {
		token, _ := createAuthToken(id, name, time.Second*10, "jwt_key")
		refresh, _ := createAuthToken(id, name, time.Minute*3, "jwt_refresh_token_key")
		db.Exec(`UPDATE Users SET refresh_token=$1 WHERE user_id=$2`, refresh.Token, id)
		user := util.ReturnedTokenStruct{
			User_photo: "photo url",
			User_name:  name,
			User_id:    id,
			Token:      token.Token,
		}
		return user, nil
	}
	return util.ReturnedTokenStruct{}, errors.New("error")
}

func createAuthToken(id string, name string, duration time.Duration, key string) (util.ReturnedTokenStruct, error) {
	tokenPayload := util.JWTokenInterface{
		User: util.UserJWT{User_id: id, User_Name: name},
		RegisteredClaims: jwt.RegisteredClaims{
			// A usual scenario is to set the expiration time relative to the current time
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			Issuer:    "test",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenPayload)
	tkt, err := token.SignedString([]byte(os.Getenv(key)))
	return util.ReturnedTokenStruct{User_id: id, User_name: name, User_photo: "", Token: tkt}, err
}

func IsTokenValid(token string) (util.ReturnedTokenStruct, error) {
	tkt, _ := jwt.ParseWithClaims(token, &util.JWTokenInterface{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("jwt_key")), nil
	})
	if tkt.Valid {
		claim, _ := tkt.Claims.(*util.JWTokenInterface)
		return util.ReturnedTokenStruct{User_id: claim.User.User_id, User_name: claim.User.User_Name, Token: token}, nil
	}
	return util.ReturnedTokenStruct{}, errors.New("token error")
}

func VerifyToken(token string) (util.ReturnedTokenStruct, error) {
	tkt, _ := jwt.ParseWithClaims(token, &util.JWTokenInterface{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("jwt_key")), nil
	})
	if tkt.Valid {
		claim, _ := tkt.Claims.(*util.JWTokenInterface)
		return createAuthToken(claim.User.User_id, claim.User.User_Name, Token_Duration, "jwt_key")
	} else {
		log.Println("Getting refresh token from db")
		var refreshToken string
		token := tkt.Claims.(*util.JWTokenInterface)
		db := db.DBInit()
		row := db.QueryRow(`SELECT refresh_token FROM Users WHERE user_id=$1`, token.User.User_id)
		if row.Scan(&refreshToken) != nil {
			log.Println("error grabbing refresh token")
			return util.ReturnedTokenStruct{}, errors.New("unathorized")
		}
		log.Println("checking if refresh token is valid")
		tkt, _ := jwt.ParseWithClaims(refreshToken, &util.JWTokenInterface{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("jwt_refresh_token_key")), nil
		})
		if tkt.Valid {
			log.Println("refresh token is valid and inserting to db")
			refreshToken, err := createAuthToken(token.User.User_id, token.User.User_Name, Refresh_Token_Duration, "jwt_refresh_token_key")
			if err != nil {
				return util.ReturnedTokenStruct{}, errors.New("unathorized")
			}
			db.Exec(`UPDATE Users SET refresh_token=$1 WHERE user_id=$2`, refreshToken.Token, refreshToken.User_id)
			return createAuthToken(token.User.User_id, token.User.User_Name, Token_Duration, "jwt_key")
		}
		return util.ReturnedTokenStruct{}, errors.New("unathorized")
	}
}

func CreateUser(newAccount util.CreateUserStruct) error {
	newAccount.Firstname = strings.ToUpper(newAccount.Firstname[0:1]) + newAccount.Firstname[1:]
	newAccount.Lastname = strings.ToUpper(newAccount.Lastname[0:1]) + newAccount.Lastname[1:]
	db := db.DBInit()
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
	db := db.DBInit()
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
	db := db.DBInit()
	row := db.QueryRow(`UPDATE Users SET user_firstname=$1, user_lastname=$2, user_adresse=$3, user_postal=$4 WHERE user_id=$5 
	RETURNING user_id, TO_CHAR(user_joined, 'Month-YYYY'), user_lastname, user_firstname, user_email, user_adresse, user_postal`, profile.Firstname, profile.Lastname, profile.Adresse, profile.Postal, user.User_id)
	if err := row.Scan(&id, &joined, &lastname, &firstname, &email, &adresse, &postal); err != nil {
		return util.UserProfile{}, errors.New("error happends")
	}
	return util.UserProfile{Id: id, Joined: joined, Firstname: firstname, Lastname: lastname, Adresse: adresse, Postal: postal, Email: email}, nil
}

func GetUserRole(userId string, companyId string) util.Role {
	db := db.DBInit()
	var mRole, mId string
	var role = util.Role{}
	member := db.QueryRow(`SELECT member_role, member_user_id FROM Member LEFT JOIN Company ON company_user_id=member_user_id WHERE member_user_id=$1 AND company_id=$2`, userId, companyId)
	member.Scan(&mRole, &mId)
	role = util.Role{Role: mRole, Id: mId}
	return role
}
