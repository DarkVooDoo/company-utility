package util

import (
	"mime/multipart"

	"github.com/golang-jwt/jwt/v5"
)

type ShiftResponse struct {
	Role  Role          `json:"role"`
	Shift []ShiftStruct `json:"shift"`
}

type TodayShift struct {
	Start string `json:"start"`
	End   string `json:"end"`
	Pause uint16 `json:"pause"`
}

type ShiftStruct struct {
	User_id     string `json:"user_id"`
	User_name   string `json:"user_name"`
	Shift_id    string `json:"shift_id"`
	Shift_date  string `json:"shift_date"`
	Shift_start string `json:"shift_start"`
	Shift_end   string `json:"shift_end"`
	Shift_day   uint16 `json:"shift_day"`
	Shift_month uint16 `json:"shift_month"`
	Shift_pause uint16 `json:"shift_pause"`
}

type CreateShift struct {
	User_id     string   `json:"user_id"`
	User_name   string   `json:"user_name"`
	Shift_date  []string `json:"shift_date"`
	Shift_start string   `json:"shift_start"`
	Shift_end   string   `json:"shift_end"`
	Shift_pause uint     `json:"shift_pause"`
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

type UpdateCompany struct {
	Id      string `json:"id"`
	Adresse string `json:"adresse"`
	Postal  string `json:"postal"`
	Ape     string `json:"ape"`
	Urssaf  string `json:"urssaf"`
	Siret   string `json:"siret"`
}

type CompanyUser struct {
	User_id   string `json:"id"`
	User_name string `json:"name"`
	User_role string `json:"role"`
}

type Company struct {
	Id             string    `json:"id"`
	Name           string    `json:"name"`
	Adresse        string    `json:"adresse"`
	Postal         uint      `json:"postal"`
	Role           Role      `json:"role"`
	HolydayPending []Holyday `json:"holyday_pending"`
}

type Member struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Role   string `json:"role"`
	UserId string `json:"user_id"`
}

type NewMember struct {
	Email     string `json:"email"`
	Worth     string `json:"worth"`
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
	User_id    string
	User_Name  string
	User_photo string
}

type UserProfile struct {
	Id        string `json:"id"`
	Joined    string `json:"joined"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Adresse   string `json:"adresse"`
	Postal    string `json:"postal"`
	Photo     string `json:"photo"`
	Birth     string `json:"birth"`
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

type Role struct {
	Role string `json:"role"`
	Id   string `json:"id"`
}

type Holyday struct {
	Id     string `json:"id"`
	From   string `json:"from"`
	To     string `json:"to"`
	Time   string `json:"time"`
	Status string `json:"status"`
	User   string `json:"user"`
	Name   string `json:"name"`
}

type JWTokenInterface struct {
	User UserJWT
	jwt.RegisteredClaims
}

type SearchStruct struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type SearchResult struct {
	UseCount     uint           `json:"user_amount"`
	CompanyCount uint           `json:"company_amount"`
	Users        []SearchStruct `json:"users"`
	Companys     []SearchStruct `json:"companys"`
}

type CurrentShiftStatus struct {
	Id      string `json:"id"`
	State   string `json:"state"`
	HourId  string `json:"hourId"`
	Seconds uint   `json:"seconds"`
}

type UpdateCurrentShift struct {
	Company string `json:"companyId"`
	Shift   string `json:"shiftId"`
	Hour    string `json:"hourId"`
	State   string `json:"state"`
	Type    string `json:"type"`
}

type NewJob struct {
	Title       string `json:"title"`
	Description string `json:"desc"`
	About       string `json:"about"`
	Expire      string `json:"expire"`
}

type Hour struct {
	Name    string `json:"name"`
	Day     string `json:"day"`
	Seconds uint   `json:"seconds"`
	Hours   string `json:"hours"`
}

type FileStruct struct {
	Name        string
	ContentType string
	File        multipart.File
}

type MultipartForm struct {
	Value map[string]string
	File  map[string]FileStruct
}

type ValueLevel struct {
	Value string `json:"value"`
	Level int    `json:"level"`
}

type PersonPath struct {
	Title         string   `json:"title"`
	Establishment string   `json:"establishment"`
	Location      string   `json:"location"`
	Date          string   `json:"date"`
	Description   []string `json:"description"`
}

type Curriculum struct {
	Photo   string       `json:"photo"`
	Name    string       `json:"name"`
	Email   string       `json:"email"`
	Tel     int          `json:"tel"`
	Age     uint16       `json:"age"`
	Adresse string       `json:"adresse"`
	Color   [3]string    `json:"color"`
	Poste   string       `json:"poste"`
	Profil  string       `json:"profil"`
	Skill   []ValueLevel `json:"skill"`
	Langue  []ValueLevel `json:"langue"`
	School  []PersonPath `json:"school"`
	Work    []PersonPath `json:"work"`
}

// type EmployéTaxe struct{
// 	Sante1 float32
// 	Sante2 float32
// 	Mutuelle float32
// 	SSDeplafond float32
// 	SSPlanfond float32

// }

// type FichePaie struct{

// }
