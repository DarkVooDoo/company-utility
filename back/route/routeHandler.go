package route

import (
	"io"
	"net/http"
)

type Handler struct {
	Res http.ResponseWriter
	Req *http.Request
}

type HandlerInterface interface {
	GET(res http.ResponseWriter, req *http.Request, handler func())
	POST(res http.ResponseWriter, req *http.Request, handler func(payload []byte))
	PUT(res http.ResponseWriter, req *http.Request, handler func(payload []byte))
	DELETE(res http.ResponseWriter, req *http.Request, handler func(payload []byte))
}

func (t Handler) GET(res http.ResponseWriter, req *http.Request, handler func()) {
	if req.Method == http.MethodGet {
		handler()
	}
}

func (t Handler) POST(res http.ResponseWriter, req *http.Request, handler func(payload []byte)) {
	if req.Method == http.MethodPost {
		body, _ := io.ReadAll(req.Body)
		handler(body)
	}
}

func (t Handler) PUT(res http.ResponseWriter, req *http.Request, handler func(payload []byte)) {
	if req.Method == http.MethodPut {
		body, _ := io.ReadAll(req.Body)
		handler(body)
	}
}

func (t Handler) DELETE(res http.ResponseWriter, req *http.Request, handler func(payload []byte)) {
	if req.Method == http.MethodDelete {
		body, _ := io.ReadAll(req.Body)
		handler(body)
	}
}
