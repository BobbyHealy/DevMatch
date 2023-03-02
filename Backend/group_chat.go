package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gopkg.in/zabawaba99/firego.v1"
)


type groupchat struct {
	GCID  		  string `json:"gcID"`
	ProjectID     string `json:"projectID"`
	UserIDs		[]string `json:"userIDs"`
	Messages    []string `json:"messages"`
}



func getGroupChat(c *gin.Context) {
	id, exists := c.GetQuery("id")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(id)
	}

	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/GroupChats/" + id
	f := firego.New(path, nil)
	var v groupchat

	if err := f.Value(&v); err != nil {
		log.Fatal(err)
		c.IndentedJSON(http.StatusBadRequest, v)
		return
	}
	if v.GCID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}
	fmt.Printf("%+v\n", v)
	c.IndentedJSON(http.StatusOK, v)
}


// postGroupChat adds a new GC
func postGroupChat(c *gin.Context) {

	var newGC groupchat

	// Call BindJSON to bind the received JSON to
	// newUser.
	if err := c.BindJSON(&newGC); err != nil {
		return
	}
	id := newGC.GCID
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/GroupChats/", nil)
	v := map[string]groupchat{id: newGC}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
		return
	}
	// Add the new album to the slice.
	c.IndentedJSON(http.StatusCreated, newGC)
}




func updateGroupChat(c *gin.Context) {
	var updatedGC groupchat
	if err := c.BindJSON(&updatedGC); err != nil {
		return
	}
	id := updatedGC.GCID
	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/GroupChats/"
	f := firego.New(path, nil)
	v := map[string]groupchat{id: updatedGC}
	if err := f.Update(v); err != nil {
		log.Fatal((err))
	}
	c.IndentedJSON(http.StatusOK, updatedGC)
}

