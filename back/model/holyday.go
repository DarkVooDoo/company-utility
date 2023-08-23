package model

import (
	"log"
	"work/util"
)

func RequestHolyday(userToken string, requestPayload util.HolydayRequestPayload) {
	log.Println(requestPayload)
}
