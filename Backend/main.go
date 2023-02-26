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
	//pushValue("test")
	//setValue("test")
	//updateValue("test")
	//getValue("test")
	queryValue("test")
	router.GET("/users", getUsers)
	router.POST("/addUser", postUsers)

	router.Run("localhost:8080")
}

// getAlbums responds with the list of all users as JSON.
func getUsers(c *gin.Context) {

	c.IndentedJSON(http.StatusOK, users)
}

func pushValue(anything string) {
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Hold", nil)
	//f.Auth("my-token")
	v := map[string]interface{}{"foo": anything}
	firego.TimeoutDuration = time.Minute

	pushedFirego, err := f.Push(v)
	if err != nil {
		fmt.Println("Error one:")
		log.Fatal(err)
	}

	var bar map[string]interface{}
	if err := pushedFirego.Value(&bar); err != nil {
		fmt.Println("Error two:")
		log.Fatal(err)
	}

	// prints "https://my-firebase-app.firebaseIO.com/-JgvLHXszP4xS0AUN-nI: bar"
	fmt.Printf("%s: %s\n", pushedFirego, bar)
}

/*
 * Avoid using set. This overrides everything
 */
func setValue(anything string) {
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Hold", nil)

	v := map[string]string{"foo": "bar"}
	if err := f.Set(v); err != nil {
		log.Fatal(err)
	}
}

/*
 * This is a good option. It updates value and pushes them if they don't exist already
 * Can only do update with JSON
 */
func updateValue(anything string) {
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Hold", nil)
	v := map[string]map[string]string{"l": {"hello": "123"}}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}
}

func queryValue(anything string) {
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Hold", nil)
	var v map[string]interface{}
	if err := f.StartAt("r").EndAt("v").LimitToFirst(2).OrderBy("field").Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", v)
}

func getValue(anything string) {
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/skillList", nil)
	var v map[string]interface{}
	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", v)
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
