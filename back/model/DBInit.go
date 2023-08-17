package model

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var database *sql.DB = nil

func DBInit() *sql.DB {
	if database != nil {
		return database
	}
	db, err := sql.Open("postgres", os.Getenv("con_string"))
	database = db
	if err != nil {
		log.Println(err)
		panic("DB Connection Error")
	}
	return db
}
