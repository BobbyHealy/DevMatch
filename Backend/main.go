package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type user struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	UserID   string `json:"userID"`
}

// albums slice to seed record album data.
var users = []user{
	{Email: "test@gmail.com", Password: "1234", UserID: "1"},
	{Email: "test2@gmail.com", Password: "1234", UserID: "2"},
	{Email: "test3@gmail.com", Password: "1234", UserID: "3"},
}

func main() {
	router := gin.Default()
	router.GET("/users", getUsers)
	router.POST("/addUser", postUsers)

	router.Run("localhost:8080")
}

// getAlbums responds with the list of all users as JSON.
func getUsers(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, users)
}

// postUsers adds a user from JSON received in the request body.
func postUsers(c *gin.Context) {
	var newUser user

	// Call BindJSON to bind the received JSON to
	// newUser.
	if err := c.BindJSON(&newUser); err != nil {
		return
	}

	// Add the new album to the slice.
	users = append(users, newUser)
	c.IndentedJSON(http.StatusCreated, newUser)
}
