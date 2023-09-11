package util

import (
	"math"
	"net/http"
	"strconv"
	"strings"
)

func EnableCors(res http.ResponseWriter, origin string) {
	res.Header().Set("Access-Control-Allow-Origin", origin)
	res.Header().Set("Access-Control-Allow-Methods", "*")
	res.Header().Set("Access-Control-Allow-Headers", "*")
}

func GetFormatedDate(date string) string {
	timeLabel := []string{"An", "Mois", "Jour", "Heure", "Minute", "Seconde"}
	for index, value := range strings.Split(date, "-") {
		if value != "00" {
			time, _ := strconv.Atoi(value)
			return strconv.Itoa(time) + " " + timeLabel[index]
		}
	}
	return ""
}

func RoundFloat(val float64, precision uint) float64 {
	ratio := math.Pow(10, float64(precision))
	return math.Round(val*ratio) / ratio
}
