package route

import "net/http"

type Handler struct {
	Res http.ResponseWriter
	Req *http.Request
}

type HandlerInterface interface {
	GET(res http.ResponseWriter, req *http.Request, handler func())
	POST(res http.ResponseWriter, req *http.Request, handler func())
	PUT(res http.ResponseWriter, req *http.Request, handler func())
	DELETE(res http.ResponseWriter, req *http.Request, handler func())
}

func (t Handler) POST(res http.ResponseWriter, req *http.Request, handler func()) {
	if req.Method == http.MethodPost {
		handler()
	}
}

func (t Handler) GET(res http.ResponseWriter, req *http.Request, handler func()) {
	if req.Method == http.MethodGet {
		handler()
	}
}

func (t Handler) PUT(res http.ResponseWriter, req *http.Request, handler func()) {
	if req.Method == http.MethodPut {
		handler()
	}
}

func (t Handler) DELETE(res http.ResponseWriter, req *http.Request, handler func()) {
	if req.Method == http.MethodDelete {
		handler()
	}
}
