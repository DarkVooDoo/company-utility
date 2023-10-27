package model

import (
	"bytes"
	"encoding/base64"
	"errors"
	"image"
	"log"
	"os"
	"strconv"
	"work/store"
	"work/util"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
	"github.com/jung-kurt/gofpdf"
)

const (
	Font_Family = "Playpen"
)

func CreateCurriculum(userId string, curriculum util.Curriculum) error {
	db := store.DBInit()
	var name, adresse, email string
	var age uint16
	user := db.QueryRow(`SELECT CONCAT(user_firstname, ' ', user_lastname), CONCAT(user_adresse, ', ', user_postal), user_email, EXTRACT('Year' FROM AGE(NOW(), user_birth)) FROM Users WHERE user_id=$1`, userId)
	if err := user.Scan(&name, &adresse, &email, &age); err != nil {
		log.Println(err)
		return errors.New("error")
	}
	curriculum.Adresse = adresse
	curriculum.Email = email
	curriculum.Age = age
	curriculum.Name = name
	reader := bytes.NewReader([]byte(curriculum.Photo))
	b64 := base64.NewDecoder(base64.RawStdEncoding, reader)
	_, imageType, err := image.Decode(b64)
	if err != nil {
		log.Println("image decode error")
		return errors.New("error")
	}
	pdf := buildCurriculum(curriculum, imageType)
	if !pdf.Ok() {
		log.Println("error pdf")
		return errors.New("error")
	}
	db.Exec(`INSERT INTO Curriculum (curriculum_profil, curriculum_poste, curriculum_education, curriculum_work, curriculum_skill, curriculum_langue, curriculum_user_id) 
	VALUES ($1,$2,$3,$4,$5,$6,$7)`, curriculum.Profil, curriculum.Poste, curriculum.School, curriculum.Work, curriculum.Skill, curriculum.Langue, userId)
	key := uuid.New().String()
	errPdf := pdf.OutputFileAndClose(key + ".pdf")
	if errPdf != nil {
		log.Println(err)
		return errors.New("error")
	}

	myS3, err := store.GetS3()
	if err != nil {
		log.Println(err)
		return errors.New("error")
	}
	file, fileError := os.Open(key + ".pdf")
	if fileError != nil {
		return errors.New("file error")
	}
	myS3.PutObject(&s3.PutObjectInput{
		Body:        file,
		ContentType: aws.String("application/pdf"),
		Key:         aws.String("curriculum/" + key),
		Bucket:      aws.String(Profile_Bucket),
	})
	if err != nil {
		log.Println(err)
		return errors.New("error creating pdf")
	}
	errF := os.Remove(key + ".pdf")
	if errF != nil {
		log.Println(err)
		return errors.New("error")
	}
	return nil

}

func buildCurriculum(curriculum util.Curriculum, imageType string) gofpdf.Pdf {

	pdf := gofpdf.New("P", "mm", "A4", "")
	pageWidth, pageHeight := pdf.GetPageSize()
	pdf.AddUTF8Font("Playpen", "B", "util/font/PlaypenSans-Bold.ttf")
	pdf.AddUTF8Font("Playpen", "", "util/font/PlaypenSans-Regular.ttf")
	leftBar := pageWidth * 40 / 100
	pdf.AddPage()
	pdf.SetFont(Font_Family, "B", 14)
	pdf.SetXY(0, 0)
	pdf.SetMargins(0, 0, 0)
	pdf.SetFillColor(218, 230, 242)
	pdf.Rect(0, 0, leftBar, pageHeight, "F")
	pdf.SetXY(0, 10)
	reader := bytes.NewReader([]byte(curriculum.Photo))
	r := base64.NewDecoder(base64.RawStdEncoding, reader)
	pdf.RegisterImageOptionsReader("photo", gofpdf.ImageOptions{
		ImageType:             imageType,
		AllowNegativePosition: true,
	}, r)
	pdf.ClipCircle((leftBar / 2), 10+(leftBar/2)/2, (leftBar/2)/2, false)
	pdf.Image("photo", (leftBar/2)/2, 10, leftBar/2, leftBar/2, true, "", 0, "")
	if !pdf.Ok() {
		log.Println("error image")
	}
	pdf.ClipEnd()
	pdf.Ln(5)
	pdf.SetFontSize(14)
	pdf.SetCellMargin(5)

	pdf.Write(5, "Profil")
	pdf.Ln(8)
	pdf.SetFont(Font_Family, "", 10)
	pdf.MultiCell(leftBar, 5, curriculum.Profil, "", "L", false)
	pdf.Ln(9)
	personelInfo(pdf, leftBar, curriculum)
	createSkillSection(pdf, leftBar, curriculum)
	createLangue(pdf, leftBar, curriculum)

	pdf.SetXY(leftBar, 10)
	pdf.SetFont(Font_Family, "B", 22)
	pdf.Cell(pageWidth-leftBar, 10, curriculum.Name)
	pdf.Ln(7)
	pdf.SetX(leftBar)
	pdf.SetFontSize(18)
	pdf.Cell(pageWidth-leftBar, 18, curriculum.Poste)
	pdf.Ln(20)
	createSchoolPath(pdf, leftBar, pageWidth, curriculum)
	createWorkPath(pdf, leftBar, pageWidth, curriculum)
	return pdf
}

func personelInfo(pdf gofpdf.Pdf, leftBar float64, cv util.Curriculum) {
	pdf.SetFont(Font_Family, "B", 14)
	pdf.WriteAligned(leftBar, 5, "Information Personnelle", "L")
	pdf.Ln(8)
	pdf.SetFont(Font_Family, "", 10)
	pdf.WriteAligned(leftBar, 5, cv.Name, "L")
	pdf.Ln(6)
	pdf.WriteAligned(leftBar, 5, strconv.Itoa(int(cv.Age)), "L")
	pdf.Ln(6)
	pdf.WriteAligned(leftBar, 5, cv.Email, "L")
	pdf.Ln(6)
	pdf.WriteAligned(leftBar, 5, cv.Adresse, "L")
	pdf.Ln(9)
}

func createSkillSection(pdf gofpdf.Pdf, leftBar float64, cv util.Curriculum) {
	pdf.SetFont(Font_Family, "B", 14)
	pdf.WriteAligned(leftBar, 5, "Compétences", "L")
	pdf.Ln(8)
	pdf.SetFont(Font_Family, "", 10)
	for _, skill := range cv.Skill {
		pdf.WriteAligned(leftBar, 5, skill.Value, "L")
		pdf.SetFillColor(0, 0, 0)
		for i := 1; i < 6; i++ {
			if skill.Level >= i {
				pdf.Circle(leftBar-float64((i*5)), pdf.GetY()+2.5, 2, "F")
			} else {
				pdf.Circle(leftBar-float64((i*5)), pdf.GetY()+2.5, 2, "D")
			}
		}
		pdf.Ln(6)
	}
	pdf.Ln(9)
}

func createLangue(pdf gofpdf.Pdf, leftBar float64, cv util.Curriculum) {
	pdf.SetFont(Font_Family, "B", 14)
	pdf.WriteAligned(leftBar, 5, "Langues", "L")
	pdf.Ln(8)
	pdf.SetFont(Font_Family, "", 10)
	for _, skill := range cv.Langue {
		pdf.WriteAligned(leftBar, 5, skill.Value, "L")
		pdf.SetFillColor(0, 0, 0)
		for i := 1; i < 6; i++ {
			if skill.Level >= i {
				pdf.Circle(leftBar-float64((i*5)), pdf.GetY()+2.5, 2, "F")
			} else {
				pdf.Circle(leftBar-float64((i*5)), pdf.GetY()+2.5, 2, "D")
			}
		}
		pdf.Ln(6)
	}
	pdf.Ln(9)
}

func createSchoolPath(pdf gofpdf.Pdf, leftBar float64, pageWidth float64, cv util.Curriculum) {

	pdf.SetX(leftBar + 5)
	pdf.SetFillColor(218, 230, 242)
	pdf.SetCellMargin(2)
	pdf.CellFormat(pageWidth-leftBar-10, 12, "Formation", "", 10, "L", true, 0, "")
	pdf.Ln(3)
	for _, school := range cv.School {
		pdf.SetX(leftBar + 5)
		pdf.SetFont(Font_Family, "B", 14)
		pdf.Cell(pageWidth-leftBar, 6, school.Title)
		pdf.Ln(8)
		pdf.SetX(leftBar + 5)
		pdf.SetFontSize(11)
		pdf.Cell(pageWidth-leftBar, 6, school.Establishment)
		pdf.SetFont(Font_Family, "", 10)
		pdf.Ln(8)
		pdf.SetFillColor(0, 0, 0)
		for _, desc := range school.Description {
			pdf.SetX(leftBar + 10)
			pdf.Circle(leftBar+9, pdf.GetY()+2.5, 1, "F")
			pdf.Cell(pageWidth-leftBar-10, 5, desc)
			pdf.Ln(6)
		}
		pdf.Ln(8)
	}
}

func createWorkPath(pdf gofpdf.Pdf, leftBar float64, pageWidth float64, cv util.Curriculum) {

	pdf.SetX(leftBar + 5)
	pdf.SetFillColor(218, 230, 242)
	pdf.SetCellMargin(2)
	pdf.SetFont(Font_Family, "B", 18)
	pdf.CellFormat(pageWidth-leftBar-10, 12, "Expérience Professionnelles", "", 10, "L", true, 0, "")
	pdf.Ln(3)
	for _, work := range cv.Work {
		pdf.SetX(leftBar + 5)
		pdf.SetFont(Font_Family, "B", 14)
		pdf.Cell(pageWidth-leftBar, 6, work.Title)
		pdf.Ln(8)
		pdf.SetX(leftBar + 5)
		pdf.SetFontSize(11)
		pdf.Cell(pageWidth-leftBar, 6, work.Establishment)
		pdf.SetFont(Font_Family, "", 10)
		pdf.Ln(8)
		pdf.SetFillColor(0, 0, 0)
		for _, desc := range work.Description {
			pdf.SetX(leftBar + 10)
			pdf.Circle(leftBar+9, pdf.GetY()+2.5, 1, "F")
			pdf.Cell(pageWidth-leftBar-10, 5, desc)
			pdf.Ln(6)
		}
		pdf.Ln(8)
	}
}
