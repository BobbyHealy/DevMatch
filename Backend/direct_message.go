package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gopkg.in/zabawaba99/firego.v1"
)

const URL = "https://somefirebaseapp.firebaseIO.com"

const authToken = "token"

type user directmessage {
	Message    string `json:"message"`
	SenderUserID   string `json:"senderUserID"`
	ReceiverUserID   string `json:"receiverUserID"`
}

func main() {
	router := gin.Default()
	//pushValue("test")
	//setValue("test")
	//updateValue("test")
	//getValue("test")
	//queryValue("test")
	//router.GET("/users", getUsers)
	//router.POST("/addUser", postUsers)

	//router.Run("localhost:8080")
}