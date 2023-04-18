package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gopkg.in/zabawaba99/firego.v1"
	//"encoding/json"
)

const URL = "https://devmatch-8f074-default-rtdb.firebaseio.com"

const authToken = "token"

/*
 * This stores the specifications of users
 * NOTE: Projects are stored by their project ids
 */
type user struct {
	UserID         string             `json:"userID"`
	Name           string             `json:"name"`
	ProjectOwned   []string           `json:"pOwned"` //This is a slice. Dynamically sized array. (Change to type project later)
	ProjectJoined  []string           `json:"pJoined"`
	Rating         float64            `json:"rating"`
	Skills         []string           `json:"skills"`
	ProfilePic     string             `json:"profilePic"`
	Description    string             `json:"description"`
	PendingInvites []string           `json:"pending"` //will hold pid of pending invitations
	WorkHours      string             `json:"workHours"`
	Ratings        map[string]float64 `json:"ratings"` //map of uid: givenRating
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
	ProjectType        string   `json:"type"`
	Milestones         []string `json:"milestones"`
	Tasks              []string `json:"tasks"`
	MaxNum             int      `json:"maxNum"`
	CurrentNum         int      `json:"currentNum"`
	Complete           bool     `json:"complete"`
	//TaskBoard     Scrumboard `json: "board"`
}

type Task struct {
	Progress  string   `json:"progress"`
	ID        string   `json:"id"`
	Category  string   `json:"category"`
	Title     string   `json:"title"`
	Assignees []string `json:"assignees"`
}

/*
 * This stores the type of search that is being requested
 * as well as the limit of search results that will be
 * returned
 */
type searchType struct {
	Project bool     `json:"project"`
	Limit   int      `json:"limit"`
	Ignore  []string `json:"ignore"`
	Skills  []string `json:"skills"`
	Name    string   `json:"name"`
}

type resume struct {
	Name        string   `json:"name"`
	Rating      float64  `json:"rating"`
	Skills      []string `json:"skills"`
	ProfilePic  string   `json:"profilePic"`
	Description string   `json:"description"`
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

	//router.POST("/addDM", postDirectMessage)
	//router.POST("/updateDM", updateDirectMessage)
	//router.GET("/directmessages", getDirectMessage)
	//router.POST("/addGC", postGroupChat)
	//router.POST("/updateGC", updateGroupChat)
	//router.GET("/groupchats", getGroupChat)

	router.GET("/prettyProject", getPrettyProject)
	router.GET("/prettyUser", getPrettyUser)
	router.POST("/userToProject", userToProject)
	router.DELETE("/removeUser", removeUser)
	router.DELETE("/removeProject", removeProject)
	router.POST("/searchFilter", searchFilter)
	router.POST("/addMilestone", addMilestone)
	router.GET("/getMilestones", getMilestones)
	router.GET("/getResume", getResume)

	router.DELETE("/removeProjectComplete", removeProjectAll)
	router.DELETE("/removeUserComplete", removeUserAll)

	router.POST("/updateProjectParts", updateProjectParts)
	router.POST("/removeUserFromProject", removeUserFromProject)
	router.POST("/removeProjectFromUser", removeProjectFromUser)

	router.POST("/addTask", addTask)
	router.GET("/getTasks", getTasks)
	//router.POST("/updateSingleTask", updateSingleTask)
	router.POST("/invite", invite)
	router.POST("/acceptInvite", acceptInvite)
	router.POST("/declineInvite", declineInvite)
	router.GET("/getPastProjects", getPastProjects)
	router.GET("/getCurrentProjects", getCurrentProjects)
	router.POST("/postRating", postRating)
	router.GET("/getRating", getRating)
	router.Run("localhost:8080")

}

func pushValue(anything string) {
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Hold", nil)
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
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Hold", nil)

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
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Hold", nil)
	v := map[string]map[string]string{"l": {"hello": "123"}}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}
}

func queryValue(anything string) {
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Users", nil)
	var v map[string]interface{}
	if err := f.OrderBy("$key").LimitToFirst(1).Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", v)
}

func getValue(anything string) {
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Users", nil)
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
	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Users/" + uid
	f := firego.New(path, nil)
	var v user

	if v.WorkHours == "" {
		v.WorkHours = "N/A"
	}

	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
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
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Users/", nil)
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
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/", nil)
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
	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/" + pid
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
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Users/"
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
		path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/"
		f := firego.New(path, nil)
		var v map[string]interface{}
		if err := f.OrderBy("$key").LimitToFirst(int64(limit)).Value(&v); err != nil {
			log.Fatal(err)
		}
		//fmt.Printf("%+v\n", v)
		c.IndentedJSON(http.StatusOK, v)
		return
	}
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Users/"
	f := firego.New(path, nil)
	var d map[string]interface{}
	if err := f.OrderBy("$key").LimitToFirst(int64(limit)).Value(&d); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", d)
	c.IndentedJSON(http.StatusOK, d)
}

func getUserFromID(uid string) user {

	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Users/" + uid
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
 * User 1 (uid1) gives User 2 (uid2) a rating
 */
func postRating(c *gin.Context) {
	uid1, exists := c.GetQuery("uid1")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(uid1)
	}

	uid2, exists := c.GetQuery("uid2")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(uid2)
	}

	rating, exists := c.GetQuery("rating")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(rating)
	}

	var u user = getUserFromID(uid2) //user to be rated
	ratings := u.Ratings
	ratingInt, err := strconv.ParseFloat(rating, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, "rating is not a number")
		return
	}
	ratings[uid1] = ratingInt
	u.Ratings = ratings
	u.Rating = calculateRating(ratings)

	updateUserHelp(u)
	c.IndentedJSON(http.StatusOK, nil)

}

func calculateRating(ratings map[string]float64) float64 {
	count := 0.0
	sum := 0.0
	for _, value := range ratings { // _ is a filler identifier so I don't have to deal with keys
		count++
		sum += value
	}
	if count == 0 {
		return 0
	}
	return float64(sum) / count

}

func getRating(c *gin.Context) {
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(uid)
	}

	var u user = getUserFromID(uid) //user to be rated

	u.Rating = calculateRating(u.Ratings)

	updateUserHelp(u)
	c.IndentedJSON(http.StatusOK, u.Rating)

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
	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Users/" + uid
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
	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/" + pid
	f := firego.New(path, nil)
	if err := f.Remove(); err != nil {
		log.Fatal(err)
	}

}

func getProjectFromID(pid string) project {

	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/" + pid
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
 * Returns array of past projects of given user
 *
 */
func getPastProjects(c *gin.Context) {
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(uid)
	}

	var u user = getUserFromID(uid)
	if u.UserID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}
	projects := append(u.ProjectOwned, u.ProjectJoined...) //merge projects owned and projects joined
	projects = removeDuplicateString(projects)             // removes duplicates (shouldn't be a problem, but just in case)
	list := getProjectsHelp(projects, 1)
	c.IndentedJSON(http.StatusOK, list)

}

/*
 * Returns array of past projects of given user
 *
 */
func getCurrentProjects(c *gin.Context) {
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(uid)
	}

	var u user = getUserFromID(uid)
	if u.UserID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}
	projects := append(u.ProjectOwned, u.ProjectJoined...) //merge projects owned and projects joined
	projects = removeDuplicateString(projects)             // removes duplicates (shouldn't be a problem, but just in case)
	list := getProjectsHelp(projects, 0)
	c.IndentedJSON(http.StatusOK, list)

}

/*
 * Gives option of past projects or currentProjects
 * 0 is current projects, 1 is past projects
 */

func getProjectsHelp(projects []string, period int) []string {

	//might have duplicates since removeUserFromProject doesn't update the new owner's project list
	var list []string = make([]string, 0)
	for j := 0; j < len(projects); j++ {
		var proj project
		proj = getProjectFromID(projects[j])
		if proj.ProjectID == "" {
			continue
		}
		if period == 0 && !proj.Complete { //seeking current projects
			list = append(list, projects[j])
		} else if period == 1 && proj.Complete {
			list = append(list, projects[j])
		}
	}
	return list
}

func removeDuplicateString(strSlice []string) []string {
	// map to store unique keys
	keys := make(map[string]bool)
	returnSlice := []string{}
	for _, item := range strSlice {
		if _, value := keys[item]; !value {
			keys[item] = true
			returnSlice = append(returnSlice, item)
		}
	}
	return returnSlice
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
	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Users/" + uid
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
	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/" + pid
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
 * will invite uid user to pid project
 */
func inviteHelp(uid string, pid string) {
	var v user
	v = getUserFromID(uid)

	if v.UserID == "" {
		fmt.Printf("invalid user")
		return
	}
	for _, a := range v.PendingInvites { //if already exists, don't do it
		if a == pid {
			return
		}
	}
	v.PendingInvites = append(v.PendingInvites, pid)
	updateUserHelp(v)
}

func invite(c *gin.Context) {
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
	inviteHelp(uid, pid)
	c.IndentedJSON(http.StatusOK, nil)
}

func respondInviteHelp(uid string, pid string, yes int) {
	var v user
	v = getUserFromID(uid)

	if v.UserID == "" {
		fmt.Printf("invalid user")
		return
	}
	pending := v.PendingInvites
	var pending2 []string = make([]string, 0)

	found := false
	for i := 0; i < len(pending); i++ {
		if !(pending[i] == pid) { //will remove pid from pending list
			pending2 = append(pending2, pending[i])
		} else if !found {
			if yes != 0 { //accepting invite
				already := false                    //already joined
				for _, a := range v.ProjectJoined { //if already exists, don't do it
					if a == pid {
						already = true
						break
					}
				}
				var proj project
				proj = getProjectFromID(pid)
				if proj.ProjectID == "" {
					fmt.Println("Project doesn't exist")
					return
				}
				if !already {
					v.ProjectJoined = append(v.ProjectJoined, pid) //add pid to pJoined
					proj.MembersID = append(proj.MembersID, uid)
					updateProjectHelp(proj)
				}
			}
			found = true //avoids doing it twice (shouldn't be possible)
		}
	}
	if !found {
		fmt.Println("Invite doesn't exist")
		return
	}
	v.PendingInvites = pending2
	updateUserHelp(v)

}

func declineInvite(c *gin.Context) {
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
	respondInviteHelp(uid, pid, 0)
	c.IndentedJSON(http.StatusOK, nil)
}

func acceptInvite(c *gin.Context) {
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
	respondInviteHelp(uid, pid, 1)
	c.IndentedJSON(http.StatusOK, nil)
}

/*
 * Use the key "uid" to get user by user id.
 * Adds user to project
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
	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"

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
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/", nil)
	v := map[string]project{id: proj}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}

}

func interfaceToStringSplice(in interface{}) []string {
	interfaceH := in.([]interface{})
	splice := make([]string, len(interfaceH))
	for i, v := range interfaceH {
		splice[i] = v.(string)
	}
	return splice
}

/*
 * Supports updating project when given only parts of the project
 */
func updateProjectParts(c *gin.Context) {
	var newProj project
	fmt.Println(c)

	projFields := []string{"owners", "name", "tmembers", "skills", "projectProfile",
		"projectBannerPic", "projectDes", "type", "milestones", "tasks", "maxNum", "currentNum", "complete"}
	// projFieldsPair := []string{"OwnersID",
	// 	"ProjectName",
	// 	"MembersID",
	// 	"NeededSkills",
	// 	"ProjectProfilePic",
	// 	"ProjectBannerPic",
	// 	"ProjectDescription",
	// 	"ProjectType"}
	// if err := c.BindJSON(&newProj); err != nil {
	// 	return
	// }
	// updateProjectHelp(newProj)

	holdMap := make(map[string]interface{})
	if err := c.BindJSON(&holdMap); err != nil {
		return
	}
	if holdMap["pid"] == nil {
		fmt.Println("need pid")
		return
	}
	pid := fmt.Sprintf("%v", holdMap["pid"])

	newProj = getProjectFromID(pid)

	for i := 0; i < len(projFields); i++ {
		hold := holdMap[projFields[i]]
		if hold != nil { //if exists in the
			switch projFields[i] { //please don't judge me
			case projFields[0]:
				newProj.OwnersID = interfaceToStringSplice(hold)
				fmt.Println(interfaceToStringSplice(hold))
			case projFields[1]:
				newProj.ProjectName = fmt.Sprintf("%v", hold)
			case projFields[2]:
				newProj.MembersID = interfaceToStringSplice(hold)
			case projFields[3]:
				newProj.NeededSkills = interfaceToStringSplice(hold)
			case projFields[4]:
				newProj.ProjectProfilePic = fmt.Sprintf("%v", hold)
			case projFields[5]:
				newProj.ProjectBannerPic = fmt.Sprintf("%v", hold)
			case projFields[6]:
				newProj.ProjectDescription = fmt.Sprintf("%v", hold)
			case projFields[7]:
				newProj.ProjectType = fmt.Sprintf("%v", hold)
			case projFields[8]:
				newProj.Milestones = interfaceToStringSplice(hold)
			case projFields[9]:
				newProj.Tasks = interfaceToStringSplice(hold)
			case projFields[10]:
				strHold := fmt.Sprintf("%v", hold)
				intVar, err := strconv.Atoi(strHold)
				if err != nil {
					log.Fatal(err)
				}
				newProj.MaxNum = intVar
			case projFields[11]:
				strHold := fmt.Sprintf("%v", hold)
				intVar, err := strconv.Atoi(strHold)
				if err != nil {
					log.Fatal(err)
				}
				newProj.CurrentNum = intVar
			case projFields[12]:
				strHold := fmt.Sprintf("%t", hold)
				boolVar, err := strconv.ParseBool(strHold)
				if err != nil {
					log.Fatal(err)
				}
				newProj.Complete = boolVar
			}
		}
	}

	// if err := json.Unmarshal([]byte(c), &personMap); err != nil {
	// 		panic(err)
	// }
	//fmt.Println(holdMap["non"])
	updateProjectHelp(newProj)
	c.IndentedJSON(http.StatusCreated, newProj)
}

func updateUserHelp(us user) {

	// Call BindJSON to bind the received JSON to
	// newUser.

	id := us.UserID
	f := firego.New("https://devmatch-8f074-default-rtdb.firebaseio.com/Users/", nil)
	v := map[string]user{id: us}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
	}

}

func removeProjHelper(pid string) {

	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"

	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/" + pid
	f := firego.New(path, nil)
	if err := f.Remove(); err != nil {
		log.Fatal(err)
	}
}
func removeUserHelper(uid string) {

	//path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Hold" + "/l/" + "hello"
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Users/" + uid
	f := firego.New(path, nil)
	if err := f.Remove(); err != nil {
		log.Fatal(err)
	}
}

func removeProjFromUser(uid string, pid string) {

	var us user = getUserFromID(uid)
	if us.UserID == "" {
		return //invalid
	}
	var owned []string = us.ProjectOwned
	var joined []string = us.ProjectJoined
	var owned2 []string = make([]string, 0)
	var joined2 []string = make([]string, 0)

	for i := 0; i < len(owned); i++ {
		if !(owned[i] == pid) {
			owned2 = append(owned2, owned[i])
		}
	}
	for i := 0; i < len(joined); i++ {
		if !(joined[i] == pid) {
			joined2 = append(joined2, joined[i])
		}
	}
	us.ProjectOwned = owned2
	us.ProjectJoined = joined2
	updateUserHelp(us)

}

func removeUserFromProj(pid string, uid string) {

	var proj project = getProjectFromID(pid)
	if proj.ProjectID == "" {
		return
	}
	var mems []string = proj.MembersID
	var owns []string = proj.OwnersID
	var mems2 []string = make([]string, 0)
	var owns2 []string = make([]string, 0)

	for i := 0; i < len(mems); i++ {
		if !(mems[i] == uid) {
			mems2 = append(mems2, mems[i])
		}
	}
	for i := 0; i < len(owns); i++ {
		if !(owns[i] == uid) {
			owns2 = append(owns2, owns[i])
		} else { //Is owner
			if len(owns) == 1 { //sole owner
				if len(mems2) >= 1 { //at least one more user
					owns2 = append(owns2, mems2[0]) //takes the first user on the list
					// NOTE: this is not adding the project pOwned for the new owner
				} else {
					removeProjHelper(pid) //remove it if no users left
					return
				}
			}
		}
	}
	proj.MembersID = mems2
	proj.OwnersID = owns2
	updateProjectHelp(proj)

}

func removeProjectFromUser(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with pid")
		return
	} else {
		fmt.Println(pid)
	}

	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with pid")
		return
	} else {
		fmt.Println(pid)
	}

	removeProjFromUser(uid, pid)
}

func removeUserFromProject(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with pid")
		return
	} else {
		fmt.Println(pid)
	}
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with pid")
		return
	} else {
		fmt.Println(pid)
	}

	removeUserFromProj(pid, uid)
}

/*
 * Removes project from all associated users
 *
 */
func removeProjectAll(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(pid)
	}

	var proj project = getProjectFromID(pid)
	var mems []string = proj.MembersID
	var owns []string = proj.OwnersID

	for i := 0; i < len(mems); i++ {
		fmt.Println(mems[i])
		removeProjFromUser(mems[i], pid)
	}
	for i := 0; i < len(owns); i++ {
		fmt.Println(owns[i])
		removeProjFromUser(owns[i], pid)
	}

	removeProjHelper(pid)
}

/*
 * Removes project from all associated users
 *
 */
func removeUserAll(c *gin.Context) {
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with key")
		return
	} else {
		fmt.Println(uid)
	}

	var us user = getUserFromID(uid)
	var joined []string = us.ProjectJoined
	var owned []string = us.ProjectOwned

	for i := 0; i < len(joined); i++ {
		fmt.Println(joined[i])
		removeUserFromProj(joined[i], uid)
	}
	for i := 0; i < len(owned); i++ {
		fmt.Println(owned[i])
		removeUserFromProj(owned[i], uid)
	}

	removeUserHelper(uid)

}

func addMilestone(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(pid)
	}
	milestone, exists2 := c.GetQuery("milestone")
	if !exists2 {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(milestone)
	}

	var proj project = getProjectFromID(pid)
	if proj.ProjectID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}
	proj.Milestones = append(proj.Milestones, milestone)
	updateProjectHelp(proj)
}

func getMilestones(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(pid)
	}
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/" + pid
	f := firego.New(path, nil)
	var v project
	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", v)

	var milestones []string
	for j := 0; j < len(v.Milestones); j++ {
		milestone := v.Milestones[j]
		milestones = append(milestones, milestone)
	}

	c.IndentedJSON(http.StatusOK, []interface{}{milestones})

}

func searchIgnore(current []string, ignore []string) []string {
	var ignored []string
	var match bool
	for i := 0; i < len(current); i++ {
		match = false
		for j := 0; j < len(ignore); j++ {
			if current[i] == ignore[j] {
				//fmt.Printf("here, %s, %s, %d\n", current[i], ignore[j], j)
				//fmt.Println()
				match = true
				break
			}
		}
		if match {
			//fmt.Printf("here2, %s\n", current[i])
		}
		if !match {
			//fmt.Println("here3 " + current[i])
			ignored = append(ignored, current[i])

		}
	}
	return ignored
}

func searchSkill(current []string, skills []string, isProject bool) []string {
	if isProject {
		var skilled []string
		for i := 0; i < len(current); i++ {
			var match bool = false
			var p project = getProjectFromID(current[i])
			var skillCheck []string = p.NeededSkills
			for j := 0; j < len(skills); j++ {
				for k := 0; k < len(skillCheck); k++ {
					//fmt.Println(skillCheck[k])
					//fmt.Println(skills[j])
					if skillCheck[k] == skills[j] {
						//fmt.Println("here k")
						match = true
						break
					}
				}
				if match {
					//fmt.Println("here j")
					break
				}
			}
			if match {
				skilled = append(skilled, current[i])
			}
		}
		return skilled
	} else {
		var skilled []string
		for i := 0; i < len(current); i++ {
			var match bool = false
			var u user = getUserFromID(current[i])
			var skillCheck []string = u.Skills
			for j := 0; j < len(skills); j++ {
				for k := 0; k < len(skillCheck); k++ {
					if skillCheck[k] == skills[j] {
						match = true
						break
					}
				}
				if match {
					break
				}
			}
			if match {
				skilled = append(skilled, current[i])
			}
		}
		return skilled
	}
}

func matchName(name string, ids []string, isProject bool) []string {
	var matched []string
	if isProject {
		var check project
		for i := 0; i < len(ids); i++ {
			check = getProjectFromID(ids[i])
			if check.ProjectName == name {
				matched = append(matched, ids[i])
			}
		}
		return matched
	} else {
		var check user
		for i := 0; i < len(ids); i++ {
			check = getUserFromID(ids[i])
			if check.Name == name {
				matched = append(matched, ids[i])
			}
		}
		return matched
	}
}

func getIDS(isProject bool) []string {
	var projOrUser string
	if isProject {
		projOrUser = "Projects"
	} else {
		projOrUser = "Users"
	}
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/" + projOrUser + "/"
	f := firego.New(path, nil)
	v := make(map[string]interface{})
	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	keys := make([]string, 0, len(v))
	for k := range v {
		if isProject {
			if len(getProjectFromID(k).MembersID) < getProjectFromID(k).MaxNum {
				keys = append(keys, k)
			}
		} else {
			keys = append(keys, k)
		}
	}
	return keys
}

func searchFilter(c *gin.Context) {
	var thisSearch searchType
	if err := c.BindJSON(&thisSearch); err != nil {
		return
	}
	isProject := thisSearch.Project
	limit := thisSearch.Limit
	skills := thisSearch.Skills
	ignore := thisSearch.Ignore
	name := thisSearch.Name

	var ids []string = getIDS(isProject)
	if name != "" {
		var matched []string = matchName(name, ids, isProject)
		c.IndentedJSON(http.StatusOK, []interface{}{matched})
	}
	if ignore[0] != "" {
		ids = searchIgnore(ids, ignore)
	}
	//var ignored []string = searchIgnore(ids, ignore)
	if skills[0] != "" {
		ids = searchSkill(ids, skills, isProject)
	}
	//fmt.Println(len(ids))
	//var skilled []string = searchSkill(ignored, skills, isProject)
	var result []string
	for i := 0; i < len(ids); i++ {
		if len(result) == limit {
			break
		}
		result = append(result, ids[i])
	}
	if isProject {
		var resultAndInfo []project
		for j := 0; j < len(result); j++ {
			resultAndInfo = append(resultAndInfo, getProjectFromID(result[j]))
		}
		c.IndentedJSON(http.StatusOK, []interface{}{resultAndInfo})
		return
	} else {
		var resultAndInfo []user
		for j := 0; j < len(result); j++ {
			resultAndInfo = append(resultAndInfo, getUserFromID(result[j]))
		}
		c.IndentedJSON(http.StatusOK, []interface{}{resultAndInfo})
		return
	}
	//c.IndentedJSON(http.StatusOK, []interface{}{result})

}

func addTask(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(pid)
	}
	task, exists2 := c.GetQuery("task")
	if !exists2 {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(task)
	}
	var proj project = getProjectFromID(pid)
	if proj.ProjectID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}
	proj.Tasks = append(proj.Tasks, task)
	updateProjectHelp(proj)
}

func getTasks(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(pid)
	}
	path := "https://devmatch-8f074-default-rtdb.firebaseio.com/Projects/" + pid
	f := firego.New(path, nil)
	var v project
	if err := f.Value(&v); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", v)

	var tasks []string
	for j := 0; j < len(v.Tasks); j++ {
		task := v.Tasks[j]
		tasks = append(tasks, task)
	}

	c.IndentedJSON(http.StatusOK, []interface{}{tasks})
}

func getResume(c *gin.Context) {
	uid, exists := c.GetQuery("uid")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(uid)
	}
	var u user = getUserFromID(uid)
	var r resume
	r.Description = u.Description
	r.Name = u.Name
	r.ProfilePic = u.ProfilePic
	r.Skills = u.Skills
	r.Rating = u.Rating
	c.IndentedJSON(http.StatusOK, r)
}

/*
The following is meant to update the task when we drag and drop to a new progress column, but not sure if it works since
its hard update the progress field right now. Leaving it out for now
*/

/*

func updateSingleTask(c *gin.Context) {
	pid, exists := c.GetQuery("pid")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(pid)
	}
	task, exists2 := c.GetQuery("task")
	if !exists2 {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(task)
	}
	var proj project = getProjectFromID(pid)
	if proj.ProjectID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}

	byteStr := []byte(task)
	var taskRemove Task
	json.Unmarshal(byteStr, &taskRemove)

	removeTaskFromProj(pid, taskRemove.ID)

	proj.Tasks = append(proj.Tasks, task)
	updateProjectHelp(proj)
}

func removeTaskFromProj(pid string, taskID string) {

	var proj project = getProjectFromID(pid)
	if proj.ProjectID == "" {
		return
	}
	var tasks []string = proj.Tasks
	var tasks2 []string = make([]string, 0)

	for i := 0; i < len(tasks); i++ {
		byteStr := []byte(tasks[i])
		var taskRemove Task
		json.Unmarshal(byteStr, &taskRemove)

		if !(taskRemove.ID == taskID) {
			tasks2 = append(tasks2, tasks[i])
		}
	}

	proj.Tasks = tasks2
	updateProjectHelp(proj)
}

*/
