package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gopkg.in/zabawaba99/firego.v1"
)

const URL = "https://devmatch-4d490-default-rtdb.firebaseio.com"

const authToken = "token"

/*
 * This stores the specifications of users
 * NOTE: Projects are stored by their project ids
 */
type user struct {
	UserID        string   `json:"userID"`
	Name          string   `json:"name"`
	ProjectOwned  []string `json:"pOwned"` //This is a slice. Dynamically sized array. (Change to type project later)
	ProjectJoined []string `json:"pJoined"`
	Rating        int      `json:"rating"`
	Skills        []string `json:"skills"`
}

/*
 * This stores the specifications of projects
 * NOTE: owners and members are stored as their user ids
 */
type project struct {
	ProjectID    string   `json:"pid"`
	OwnersID     []string `json:"owners"`
	ProjectName  string   `json:"name"`
	MembersID    []string `json:"members"`
	NeededSkills []string `json:"skills"`
	//TaskBoard     Scrumboard `json: "board"`
}

func main() {
	router := gin.Default()
	//pushValue("test")
	//setValue("test")
	//updateValue("test")
	//getValue("test")
	//queryValue("test")
	router.GET("/users", getUsers)
	router.POST("/addUser", postUsers)
	router.GET("/projects", getProject)
	router.POST("/addProject", postProject)

	router.Run("localhost:8080")
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
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/", nil)
	var v map[string]interface{}
	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", v)
}

/*
 * Use the key "uid" to get user by user id.
 */
func getUsers(c *gin.Context) {
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(uid)
	}
	//path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Users/" + uid
	f := firego.New(path, nil)
	var v user
	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", v)
	c.IndentedJSON(http.StatusOK, v)
}

// postUsers adds a user from JSON received in the request body.
func postUsers(c *gin.Context) {

	var newUser user

	// Call BindJSON to bind the received JSON to
	// newUser.
	if err := c.BindJSON(&newUser); err != nil {
		return
	}
	id := newUser.UserID
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Users/", nil)
	v := map[string]user{id: newUser}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}
	// Add the new album to the slice.
	c.IndentedJSON(http.StatusCreated, newUser)
}

func postProject(c *gin.Context) {

	var newProj project

	// Call BindJSON to bind the received JSON to
	// newUser.
	if err := c.BindJSON(&newProj); err != nil {
		return
	}
	id := newProj.ProjectID
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Projects/", nil)
	v := map[string]project{id: newProj}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}
	c.IndentedJSON(http.StatusCreated, newProj)
}

/*
 * Use the key "uid" to get user by user id.
 */
func getProject(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(pid)
	}
	//path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Projects/" + pid
	f := firego.New(path, nil)
	var v project
	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", v)
	c.IndentedJSON(http.StatusOK, v)
}
