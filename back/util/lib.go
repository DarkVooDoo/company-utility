package util

import "net/http"

func EnableCors(res http.ResponseWriter, origin string) {
	res.Header().Set("Access-Control-Allow-Origin", origin)
	res.Header().Set("Access-Control-Allow-Methods", "*")
	res.Header().Set("Access-Control-Allow-Headers", "*")
}
