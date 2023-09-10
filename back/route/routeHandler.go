package route

import (
	"errors"
	"io"
	"net/http"
	"os"
	"time"
	"work/model"
	util "work/util"

	"github.com/golang-jwt/jwt/v5"
)

type HandlerInterface interface {
	GET(handler func())
	POST(handler func(payload []byte))
	PUT(handler func(payload []byte))
	DELETE(handler func(payload []byte))
}

type Route struct {
	Response http.ResponseWriter
	Request  *http.Request
	Cors     string
	Payload  []byte
	HandlerInterface
}

func (r *Route) VerifyToken() (util.ReturnedTokenStruct, error) {
	tkt, err := jwt.ParseWithClaims(r.Request.Header.Get("Authorization"), &util.JWTokenInterface{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("jwt_key")), nil
	})
	if err != nil {
		return util.ReturnedTokenStruct{}, errors.New("unathorized")
	}
	if tkt.Valid {
		claim, _ := tkt.Claims.(*util.JWTokenInterface)
		tokenPayload := util.JWTokenInterface{
			User: util.UserJWT{User_id: claim.User.User_id, User_Name: claim.User.User_Name},
			RegisteredClaims: jwt.RegisteredClaims{
				// A usual scenario is to set the expiration time relative to the current time
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(model.Token_Duration)),
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

func (r *Route) GET(handler func()) {

	util.EnableCors(r.Response, r.Cors)
	if r.Request.Method == http.MethodGet {
		handler()
	}
}

func (r *Route) POST(handler func()) {
	if r.Request.Method == http.MethodPost {
		util.EnableCors(r.Response, r.Cors)
		body, _ := io.ReadAll(r.Request.Body)
		r.Payload = body
		handler()
	}
}

func (r *Route) PUT(handler func()) {
	if r.Request.Method == http.MethodPut {
		util.EnableCors(r.Response, r.Cors)
		body, _ := io.ReadAll(r.Request.Body)
		r.Payload = body
		handler()
	}
}

func (r *Route) PATCH(handler func()) {
	if r.Request.Method == http.MethodPatch {
		util.EnableCors(r.Response, r.Cors)
		body, _ := io.ReadAll(r.Request.Body)
		r.Payload = body
		handler()
	}
}

func (r *Route) DELETE(handler func()) {
	if r.Request.Method == http.MethodDelete {
		util.EnableCors(r.Response, r.Cors)
		body, _ := io.ReadAll(r.Request.Body)
		r.Payload = body
		handler()
	}
}
