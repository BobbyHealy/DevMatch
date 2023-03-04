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
	ProfilePic    string   `json:"profilePic"`
	Description   string   `json:"description"`
}

/*
 * This stores the specifications of projects
 * NOTE: owners and members are stored as their user ids
 */
type project struct {
	ProjectID          string   `json:"pid"`
	OwnersID           []string `json:"owners"`
	ProjectName        string   `json:"name"`
	MembersID          []string `json:"tmembers"`
	NeededSkills       []string `json:"skills"`
	ProjectProfilePic  string   `json:"projectProfile"`
	ProjectBannerPic   string   `json:"projectBannerPic"`
	ProjectDescription string   `json:"projectDes"`
	//TaskBoard     Scrumboard `json: "board"`
}

/*
 * This stores the type of search that is being requested
 * as well as the limit of search results that will be
 * returned
 */
type searchType struct {
	Project bool `json:"project"`
	Limit   int  `json:"limit"`
}

func main() {
	router := gin.Default()
	//pushValue("test")
	//setValue("test")
	//updateValue("test")
	//getValue("test")
	//queryValue("test")
	router.GET("/users", getUsers)
	router.POST("/updateUser", updateUser)
	router.POST("/addUser", postUsers)
	router.GET("/projects", getProject)
	router.POST("/addProject", postProject)
	router.POST("/updateProject", updateProject)
	router.POST("/search", search)

	router.POST("/addDM", postDirectMessage)
	router.POST("/updateDM", updateDirectMessage)
	router.GET("/directmessages", getDirectMessage)
	router.POST("/addGC", postGroupChat)
	router.POST("/updateGC", updateGroupChat)
	router.GET("/groupchats", getGroupChat)

	router.GET("/prettyProject", getPrettyProject)
	router.GET("/prettyUser", getPrettyUser)
	router.POST("/userToProject", userToProject)
	router.DELETE("/removeUser", removeUser)
	router.DELETE("/removeProject", removeProject)

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
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Users", nil)
	var v map[string]interface{}
	if err := f.OrderBy("$key").LimitToFirst(1).Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", v)
}

func getValue(anything string) {
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Users", nil)
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
	if newUser.ProfilePic == "" {
		newUser.ProfilePic = "https://www.nicepng.com/png/detail/73-730154_open-default-profile-picture-png.png"
	}

	v := map[string]user{id: newUser}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}
	// Add the new album to the slice.
	c.IndentedJSON(http.StatusCreated, newUser)
}

func postProject(c *gin.Context) {

	var newProj project

	if newProj.ProjectProfilePic == "" {
		newProj.ProjectProfilePic = "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg"
	}
	if newProj.ProjectBannerPic == "" {
		newProj.ProjectBannerPic = "https://image-assets.eu-2.volcanic.cloud/api/v1/assets/images/28728ddd294b901834ed795e605dfa98?t=1674127305&webp_fallback=png"
	}

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

func updateUser(c *gin.Context) {
	var updatedUser user
	if err := c.BindJSON(&updatedUser); err != nil {
		return
	}
	uid := updatedUser.UserID
	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Users/"
	f := firego.New(path, nil)
	v := map[string]user{uid: updatedUser}
	if err := f.Update(v); err != nil {
		log.Fatal((err))
	}
	c.IndentedJSON(http.StatusOK, updatedUser)
}

func search(c *gin.Context) {
	var thisSearch searchType
	//fmt.Println("here")
	if err := c.BindJSON(&thisSearch); err != nil {
		return
	}
	//fmt.Println("here2")
	isProject := thisSearch.Project
	limit := thisSearch.Limit
	if isProject {
		path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Projects/"
		f := firego.New(path, nil)
		var v map[string]interface{}
		if err := f.OrderBy("$key").LimitToFirst(int64(limit)).Value(&v); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%+v\n", v)
		c.IndentedJSON(http.StatusOK, v)
		return
	}
	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Users/"
	f := firego.New(path, nil)
	var d map[string]interface{}
	if err := f.OrderBy("$key").LimitToFirst(int64(limit)).Value(&d); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", d)
	c.IndentedJSON(http.StatusOK, d)
}

func getUserFromID(uid string) user {

	//path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Users/" + uid
	f := firego.New(path, nil)
	var v user

	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	if v.UserID == "" {
		return user{}
	}
	return v
}

/*
 * Gets project from pid along with array of names of members and array of owners
 */

func removeUser(c *gin.Context) {
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
	if err := f.Remove(); err != nil {
		log.Fatal(err)
	}
}

func removeProject(c *gin.Context) {
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
	if err := f.Remove(); err != nil {
		log.Fatal(err)
	}

}

func getProjectFromID(pid string) project {

	//path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Projects/" + pid
	f := firego.New(path, nil)
	var v project

	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	if v.ProjectID == "" {
		return project{}
	}
	return v
}

/*
 * Use the key "uid" to get user by user id.
 */
func getPrettyUser(c *gin.Context) {
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
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
		c.IndentedJSON(http.StatusBadRequest, v)
		return
	}
	if v.UserID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}
	fmt.Printf("%+v\n", v)

	var names []string //names of members
	for j := 0; j < len(v.ProjectJoined); j++ {
		name := getProjectFromID(v.ProjectJoined[j]).ProjectName
		names = append(names, name)
	}

	var ownerNames []string //names of owners
	for j := 0; j < len(v.ProjectOwned); j++ {
		name := getProjectFromID(v.ProjectOwned[j]).ProjectName
		ownerNames = append(ownerNames, name)
	}

	c.IndentedJSON(http.StatusOK, []interface{}{v, names, ownerNames})
	if err := f.Remove(); err != nil {
		log.Fatal(err)
	}
}

/*
 * Use the key "uid" to get user by user id.
 */
func getPrettyProject(c *gin.Context) {
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

	var names []string //names of members
	for j := 0; j < len(v.MembersID); j++ {
		name := getUserFromID(v.MembersID[j]).Name
		names = append(names, name)
	}

	var ownerNames []string //names of owners
	for j := 0; j < len(v.OwnersID); j++ {
		name := getUserFromID(v.OwnersID[j]).Name
		ownerNames = append(ownerNames, name)
	}

	c.IndentedJSON(http.StatusOK, []interface{}{v, names, ownerNames})

}

func updateProject(c *gin.Context) {
	var newProj project
	if err := c.BindJSON(&newProj); err != nil {
		return
	}
	updateProjectHelp(newProj)
	c.IndentedJSON(http.StatusCreated, newProj)
}

/*
 * Use the key "uid" to get user by user id.
 */
func userToProject(c *gin.Context) {
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(uid)
	}

	pid, exists2 := c.GetQuery("pid")
	if !exists2 {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(pid)
	}

	owner, exists3 := c.GetQuery("isOwner")
	if !exists3 {
		owner = "false"
	}
	//path := "https://devmatch-4d490-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"

	var v user
	v = getUserFromID(uid)

	if v.UserID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}

	var proj project
	proj = getProjectFromID(pid)
	if proj.ProjectID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}

	v.ProjectJoined = append(v.ProjectJoined, pid)
	proj.MembersID = append(proj.MembersID, uid)
	if owner == "true" {
		v.ProjectOwned = append(v.ProjectOwned, pid)
		proj.OwnersID = append(proj.OwnersID, uid)
	}
	updateProjectHelp(proj)
	updateUserHelp(v)

}

func updateProjectHelp(proj project) {

	// Call BindJSON to bind the received JSON to
	// newUser.

	id := proj.ProjectID
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Projects/", nil)
	v := map[string]project{id: proj}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}

}

func updateUserHelp(us user) {

	// Call BindJSON to bind the received JSON to
	// newUser.

	id := us.UserID
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/Users/", nil)
	v := map[string]user{id: us}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}

}
