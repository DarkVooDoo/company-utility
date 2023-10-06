package route

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
	"os"
	"time"
	"work/model"
	util "work/util"

	"github.com/golang-jwt/jwt/v5"
)

type HandlerInterface interface {
	GET(handler func())
	POST(handler func())
	PUT(handler func())
	DELETE(handler func())
}

type ResponseError struct {
	Msg string
}

type Route struct {
	Response      http.ResponseWriter
	Request       *http.Request
	Cors          string
	Payload       []byte
	MultipartForm util.MultipartForm
	HandlerInterface
}

func (r *Route) GetQuery(name string) string {
	return r.Request.URL.Query().Get(name)
}

func (r *Route) WriteJSON(status int, st interface{}) {
	r.Response.WriteHeader(status)
	r.Response.Header().Add("Content-Type", "application/json")
	body, _ := json.Marshal(st)
	r.Response.Write(body)
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
			User: util.UserJWT{User_id: claim.User.User_id, User_Name: claim.User.User_Name, User_photo: claim.User.User_photo},
			RegisteredClaims: jwt.RegisteredClaims{
				// A usual scenario is to set the expiration time relative to the current time
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(model.Token_Duration)),
				Issuer:    "test",
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenPayload)
		tkt, _ := token.SignedString([]byte(os.Getenv("jwt_key")))
		return util.ReturnedTokenStruct{User_id: claim.User.User_id, User_name: claim.User.User_Name, User_photo: claim.User.User_photo, Token: tkt}, nil
	} else {
		return util.ReturnedTokenStruct{}, errors.New("unathorized")
	}
}

func (r *Route) ReadJsonPayload() {
	body, _ := io.ReadAll(r.Request.Body)
	r.Payload = body
}

func (r *Route) GET(handler func()) {

	util.EnableCors(r.Response, r.Cors)
	if r.Request.Method == http.MethodGet {
		handler()
	}
}

func (r *Route) POST(handler func()) {
	util.EnableCors(r.Response, r.Cors)
	if r.Request.Method == http.MethodPost {
		if err := r.getRequestBody(); err != nil {
			r.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "error"})
			return
		}
		handler()
	}
}

func (r *Route) PUT(handler func()) {
	util.EnableCors(r.Response, r.Cors)
	if r.Request.Method == http.MethodPut {
		if err := r.getRequestBody(); err != nil {
			r.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "error"})
			return
		}
		handler()
	}
}

func (r *Route) PATCH(handler func()) {
	util.EnableCors(r.Response, r.Cors)
	if r.Request.Method == http.MethodPatch {
		if err := r.getRequestBody(); err != nil {
			r.WriteJSON(http.StatusBadRequest, ResponseError{Msg: "error"})
			return
		}
		handler()
	}
}

func (r *Route) DELETE(handler func()) {
	util.EnableCors(r.Response, r.Cors)
	if r.Request.Method == http.MethodDelete {
		body, _ := io.ReadAll(r.Request.Body)
		r.Payload = body
		handler()
	}
}

func (r *Route) getRequestBody() error {
	contenType := r.Request.Header.Get("Content-Type")
	mediaType, _, _ := mime.ParseMediaType(contenType)
	if mediaType == "multipart/form-data" {
		var multiPart util.MultipartForm = util.MultipartForm{Value: map[string]string{}, File: map[string]util.FileStruct{}}
		if err := r.Request.ParseMultipartForm(0); err != nil {
			log.Println("max bytes")
			return errors.New("error")
		}
		for key, value := range r.Request.MultipartForm.Value {
			multiPart.Value[key] = value[0]
		}
		for key, file := range r.Request.MultipartForm.File {
			fileDescription := file[0]
			myFile, fileErr := file[0].Open()
			if fileErr != nil {
				//Handle error
				log.Println(fileErr)
			}
			multiPart.File[key] = struct {
				Name        string
				ContentType string
				File        multipart.File
			}{
				Name:        fileDescription.Filename,
				ContentType: fileDescription.Header.Get("Content-Type"),
				File:        myFile,
			}
		}
		r.MultipartForm = multiPart
		return nil
	} else {
		body, err := io.ReadAll(r.Request.Body)
		if err != nil {
			log.Println("read body error")
			return errors.New("error")
		}
		r.Payload = body
		return nil
	}
}
