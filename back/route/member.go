package route

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"work/model"
	"work/util"
)

func MemberRoute(res http.ResponseWriter, req *http.Request) {
	util.EnableCors(res, "http://localhost:3000")
	var router HandlerInterface = Handler{Req: req, Res: res}
	router.POST(res, req, func() {
		var newMember util.NewMember
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &newMember)
		if newUser, err := model.AddNewMember(newMember, req.Header.Get("Authorization")); err != nil {
			log.Println(err)
			http.Error(res, "bad request", http.StatusBadRequest)
		} else {
			body, _ := json.Marshal(newUser)
			res.Header().Add("Content-Type", "application/json")
			res.Write(body)
		}
	})

	router.DELETE(res, req, func() {
		var deleteMember util.DeleteMember
		body, _ := io.ReadAll(req.Body)
		json.Unmarshal(body, &deleteMember)
		if err := model.DeleteMember(deleteMember, req.Header.Get("Authorization")); err != nil {
			log.Println(err)
			http.Error(res, "bad request", http.StatusBadRequest)
		} else {
			res.Write([]byte("Deleted"))
		}
	})
}
