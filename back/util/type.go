package util

import "github.com/golang-jwt/jwt/v5"

type ShiftResponse struct {
	Role  string        `json:"role"`
	Shift []ShiftStruct `json:"shift"`
}

type TodayShift struct {
	Start string `json:"start"`
	End   string `json:"end"`
	Pause uint16 `json:"pause"`
}

type ShiftStruct struct {
	User_id     string   `json:"user_id"`
	User_name   string   `json:"user_name"`
	Shift_id    string   `json:"shift_id"`
	Shift_date  []string `json:"shift_date"`
	Shift_start string   `json:"shift_start"`
	Shift_end   string   `json:"shift_end"`
	Shift_day   uint16   `json:"shift_day"`
	Shift_month uint16   `json:"shift_month"`
	Shift_pause uint16   `json:"shift_pause"`
	Company_id  string   `json:"company_id"`
}

type NewShiftCalendarPayload struct {
	UserId    string `json:"userId"`
	CompanyId string `json:"companyId"`
	Date      string `json:"date"`
}

type ShiftDayTaken struct {
	Shift_day uint16 `json:"day"`
}

type ModifyShiftStruct struct {
	Start string `json:"shift_start"`
	End   string `json:"shift_end"`
	Pause uint16 `json:"shift_pause"`
	Id    string `json:"shift_id"`
}

type CreateCompany struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Adresse string `json:"adresse"`
	Postal  uint   `json:"postal"`
}

type CompanyUser struct {
	User_id   string `json:"user_id"`
	User_name string `json:"user_name"`
	User_role string `json:"user_role"`
}

type Company struct {
	Id                   string   `json:"id"`
	Name                 string   `json:"name"`
	Adresse              string   `json:"adresse"`
	Postal               uint     `json:"postal"`
	Members              []Member `json:"members"`
	HolydayPendingAmount string   `json:"holyday_pending"`
}

type Member struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Role string `json:"role"`
}

type NewMember struct {
	Email     string `json:"email"`
	CompanyId string `json:"companyId"`
	Role      string `json:"role"`
}

type DeleteMember struct {
	CompanyId string `json:"companyId"`
	Id        string `json:"id"`
}

type CreateUserStruct struct {
	Email     string `json:"email"`
	Lastname  string `json:"lastname"`
	Firstname string `json:"firstname"`
	Password  string `json:"password"`
}

type SignUserPayloadStruct struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ReturnedTokenStruct struct {
	User_photo string `json:"user_photo"`
	User_name  string `json:"user_name"`
	User_id    string `json:"user_id"`
	Token      string `json:"user_token"`
}

type UserJWT struct {
	User_id   string
	User_Name string
}

type UserProfile struct {
	Id        string `json:"id"`
	Joined    string `json:"joined"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Adresse   string `json:"adresse"`
	Postal    string `json:"postal"`
	Email     string `json:"email"`
}

type Notification struct {
	Id      string `json:"id"`
	Message string `json:"message"`
	Date    string `json:"date"`
}

type HolydayRequestPayload struct {
	From      string `json:"from"`
	To        string `json:"to"`
	CompanyId string `json:"companyId"`
	Type      string `json:"type"`
}

type Holyday struct {
	Id     string `json:"id"`
	From   string `json:"from"`
	To     string `json:"to"`
	Status string `json:"status"`
}

type JWTokenInterface struct {
	User UserJWT
	jwt.RegisteredClaims
}
