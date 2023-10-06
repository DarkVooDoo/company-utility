package store

import (
	"database/sql"
	"errors"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	_ "github.com/lib/pq"
)

var database *sql.DB = nil

func DBInit() *sql.DB {
	if database != nil {
		return database
	}
	db, err := sql.Open("postgres", os.Getenv("con_string"))
	db.SetMaxOpenConns(30)
	db.SetConnMaxIdleTime(time.Second * 5)
	database = db
	if err != nil {
		log.Println(err)
		panic("DB Connection Error")
	}
	return db
}

func GetS3() (*s3.S3, error) {
	creds := credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS"), os.Getenv("AWS_SECRET_ACCESS"), "")
	_, err := creds.Get()
	if err != nil {
		return nil, errors.New("credential error")
	}
	cfg := aws.NewConfig().WithRegion("eu-west-3").WithCredentials(creds)
	session, sessionErr := session.NewSession(cfg)
	if sessionErr != nil {
		return nil, errors.New("session error")
	}
	return s3.New(session), nil
}
