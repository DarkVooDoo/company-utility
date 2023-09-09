package db

import (
	"database/sql"
	"log"
	"os"
	"time"

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
