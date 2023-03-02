package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gopkg.in/zabawaba99/firego.v1"
)


type directmessage struct {
	DMID  		  string `json:"dmID"`
	UserOne 	  string `json:"userOne"`
	UserTwo 	  string `json:"userTwo"`
	Messages    []string `json:"messages"`
}



func getDirectMessage(c *gin.Context) {
	id, exists := c.GetQuery("id")
	if !exists {
		fmt.Println("Request with key")
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	} else {
		fmt.Println(id)
	}

	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/DirectMessages/" + id
	f := firego.New(path, nil)
	var v directmessage

	if err := f.Value(&v); err != nil {
		log.Fatal(err)
		c.IndentedJSON(http.StatusBadRequest, v)
		return
	}
	if v.DMID == "" {
		c.IndentedJSON(http.StatusBadRequest, nil)
		return
	}
	fmt.Printf("%+v\n", v)
	c.IndentedJSON(http.StatusOK, v)
}


// postDirectMessage adds a new DM
func postDirectMessage(c *gin.Context) {

	var newDM directmessage

	// Call BindJSON to bind the received JSON to
	// newUser.
	if err := c.BindJSON(&newDM); err != nil {
		return
	}
	id := newDM.DMID
	f := firego.New("https://devmatch-4d490-default-rtdb.firebaseio.com/DirectMessages/", nil)
	v := map[string]directmessage{id: newDM}
	if err := f.Update(v); err != nil {
		log.Fatal(err)
		return
	}
	// Add the new album to the slice.
	c.IndentedJSON(http.StatusCreated, newDM)
}




func updateDirectMessage(c *gin.Context) {
	var updatedDM directmessage
	if err := c.BindJSON(&updatedDM); err != nil {
		return
	}
	id := updatedDM.DMID
	path := "https://devmatch-4d490-default-rtdb.firebaseio.com/DirectMessages/"
	f := firego.New(path, nil)
	v := map[string]directmessage{id: updatedDM}
	if err := f.Update(v); err != nil {
		log.Fatal((err))
	}
	c.IndentedJSON(http.StatusOK, updatedDM)
}

