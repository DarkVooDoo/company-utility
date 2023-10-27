package model

import (
	"database/sql"
	"errors"
	"log"
	"os"
	"strings"
	"time"
	"work/store"
	"work/util"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

const (
	Profile_Bucket         = "cdn-connected"
	Token_Duration         = 5 * time.Hour
	Refresh_Token_Duration = (24 * 10) * time.Hour
)

func SignInUser(conn util.SignUserPayloadStruct) (util.ReturnedTokenStruct, error) {
	var db = store.DBInit()
	var row *sql.Row
	var id, name, password, photo string
	row = db.QueryRow(`SELECT user_id, CONCAT(user_firstname, ' ', LEFT(user_lastname, 1), '.') as user_name, user_password, user_photo FROM Users WHERE user_email=$1 AND user_password=$2`, conn.Email, conn.Password)

	if err := row.Scan(&id, &name, &password, &photo); id != "" || err == nil {
		token, _ := createAuthToken(id, name, photo, Token_Duration, "jwt_key")
		refresh, _ := createAuthToken(id, name, photo, Refresh_Token_Duration, "jwt_refresh_token_key")
		db.Exec(`UPDATE Users SET refresh_token=$1 WHERE user_id=$2`, refresh.Token, id)
		user := util.ReturnedTokenStruct{
			User_photo: photo,
			User_name:  name,
			User_id:    id,
			Token:      token.Token,
		}
		return user, nil
	}
	return util.ReturnedTokenStruct{}, errors.New("error")
}

func createAuthToken(id string, name string, photo string, duration time.Duration, key string) (util.ReturnedTokenStruct, error) {
	tokenPayload := util.JWTokenInterface{
		User: util.UserJWT{User_id: id, User_Name: name, User_photo: photo},
		RegisteredClaims: jwt.RegisteredClaims{
			// A usual scenario is to set the expiration time relative to the current time
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
			Issuer:    "test",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenPayload)
	tkt, err := token.SignedString([]byte(os.Getenv(key)))
	return util.ReturnedTokenStruct{User_id: id, User_name: name, User_photo: photo, Token: tkt}, err
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

func CreateUser(newAccount util.CreateUserStruct) error {
	newAccount.Firstname = strings.ToUpper(newAccount.Firstname[0:1]) + newAccount.Firstname[1:]
	newAccount.Lastname = strings.ToUpper(newAccount.Lastname[0:1]) + newAccount.Lastname[1:]
	db := store.DBInit()
	result, err := db.Exec(`INSERT INTO Users (user_email, user_lastname, user_firstname, user_password) VALUES($1,$2,$3,$4)`, newAccount.Email, newAccount.Lastname, newAccount.Firstname, newAccount.Password)
	affected, _ := result.RowsAffected()
	if err != nil && affected == 0 {
		return errors.New("error happends")
	}
	return nil
}

func GetUserProfile(userId string) (util.UserProfile, error) {
	db := store.DBInit()
	var id, firstname, lastname, adresse, postal, email, joined, photo, birth string
	row := db.QueryRow(`SELECT user_id, TO_CHAR(user_joined, 'TMMonth-YYYY'), user_lastname, user_firstname, user_email, user_adresse, user_postal, user_photo, TO_CHAR(user_birth, 'YYYY-MM-DD') FROM Users WHERE user_id=$1`, userId)
	row.Scan(&id, &joined, &lastname, &firstname, &email, &adresse, &postal, &photo, &birth)
	log.Println(photo)
	return util.UserProfile{Id: id, Joined: joined, Firstname: firstname, Lastname: lastname, Adresse: adresse, Postal: postal, Email: email, Photo: photo, Birth: birth}, nil
}

func ModifyProfile(profile util.UserProfile, userId string) (util.UserProfile, error) {
	var id, firstname, lastname, adresse, postal, email, joined, birth string
	db := store.DBInit()
	row := db.QueryRow(`UPDATE Users SET user_firstname=$1, user_lastname=$2, user_adresse=$3, user_postal=$4, user_birth=$5 WHERE user_id=$6 
	RETURNING user_id, TO_CHAR(user_joined, 'Month-YYYY'), user_lastname, user_firstname, user_email, user_adresse, user_postal, user_birth`, profile.Firstname, profile.Lastname, profile.Adresse, profile.Postal, profile.Birth, userId)
	if err := row.Scan(&id, &joined, &lastname, &firstname, &email, &adresse, &postal, &birth); err != nil {
		return util.UserProfile{}, errors.New("error happends")
	}
	return util.UserProfile{Id: id, Joined: joined, Firstname: firstname, Lastname: lastname, Adresse: adresse, Postal: postal, Email: email, Birth: birth}, nil
}

func GetUserRole(userId string, companyId string) util.Role {
	db := store.DBInit()
	var mRole, mId string
	var role = util.Role{}
	member := db.QueryRow(`SELECT member_role, member_user_id FROM Member LEFT JOIN Company ON company_user_id=member_user_id WHERE member_user_id=$1 AND company_id=$2`, userId, companyId)
	member.Scan(&mRole, &mId)
	role = util.Role{Role: mRole, Id: mId}
	return role
}

func UpdateUserPhoto(userId string, photoId string, file util.FileStruct) error {
	var key string
	if photoId == "" {
		var uuid = uuid.New()
		key = uuid.String()
	} else {
		key = photoId
	}
	myS3, _ := store.GetS3()
	_, err := myS3.PutObject(&s3.PutObjectInput{
		Body:        file.File,
		ContentType: aws.String(file.ContentType),
		Metadata:    aws.StringMap(aws.StringValueMap(map[string]*string{})),
		Key:         aws.String("profile/" + key),
		Bucket:      aws.String(Profile_Bucket),
	})

	if err != nil {
		log.Println(err)
		return errors.New("error")
	}
	db := store.DBInit()
	_, uErr := db.Exec(`UPDATE Users SET user_photo=$1 WHERE user_id=$2`, key, userId)
	if uErr != nil {
		return errors.New("error")
	}
	return nil
}
