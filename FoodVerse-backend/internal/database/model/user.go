package model

type User struct {
	Id uint `gorm:"primarykey" json:"id"`
	FullName string `json:"fullname"`
	Email string `json:"email"`
	Password string `json:"password"`
}