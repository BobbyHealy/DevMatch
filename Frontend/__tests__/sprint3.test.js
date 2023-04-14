import { db } from "../config/firebase";

import {
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { sendMsg,pinMsg,unpinMsg } from "../fireStoreBE/DmMsg";
import { sendMsg as sendGC,pinMsg as pinGC,unpinMsg as unpinGC} from "../fireStoreBE/GCMsg";
const email = "jesttestemail@jesttestemail.com";
const password = "123456";
const senderID = "jestUID"
const receiverID = "jestUID2"
const DMID = senderID +"-"+receiverID
const msgID = uuid();
const text = "This is jest Test"
const pid = "JestProj";
const channel ="jestChannel"
const user ={
    userID: senderID,
    name: "JestName",
    profilePic: "https://www.nicepng.com/png/detail/73-730154_open-default-profile-picture-png.png"
}

describe("Pin and Unpin Test (User Story #7)", () => {
    test("A DM is default as unpin", async () => {
        await setDoc(doc(db, "userChats",senderID ), {});
        await setDoc(doc(db, "userChats", receiverID), {});
        await sendMsg(DMID, msgID, senderID,receiverID, text)
        const queryData = query(doc(db, "chats", DMID, "messages", msgID ));
        const msg= await getDoc(queryData);
        expect(msg.data().pinned).toBe(false);

    }, 10000);
    test("User can pin a msg in DMs", async () => {
        const queryData = query(doc(db, "chats", DMID, "messages", msgID ));
        const msg= await getDoc(queryData);
        await pinMsg(DMID,msgID,msg.data(),senderID)
        const result= await getDoc(queryData);
        expect(result.data().pinned).toBe(true);
    }, 10000);
    test("User can unpin a msg in DMs", async () => {
        const queryData = query(doc(db, "chats", DMID, "messages", msgID ));
        const msg= await getDoc(queryData);
        // make sure it is pinned before unpin
        expect(msg.data().pinned).toBe(true);
        // unpin the msg
        await unpinMsg(DMID,msgID,msg.data(),senderID)
        const result= await getDoc(queryData);
        expect(result.data().pinned).toBe(false);
        deleteDoc(doc(db, "userChats",senderID ));
        deleteDoc(doc(db, "userChats", receiverID));
        await deleteDoc(doc(db, "chats", DMID, "messages", msgID));
        deleteDoc(doc(db, "chats",  DMID));
    }, 10000);
    test("Msgs in GC are default as unpin", async () => {
        //send a messege in the Jest test GC
        await  sendGC(pid,channel,msgID,user,text)
        //Fetch the Msg in the GC
        const queryData = query(doc(db, "GCs", pid,"channels", channel, "messages", msgID));
        const msg= await getDoc(queryData);
        //Check if pinned is false 
        expect(msg.data().pinned).toBe(false);
    }, 10000);
    test("User can pin a msg in GC", async () => {
        //Fetch the Msg in the GC
        const queryData = query(doc(db, "GCs", pid,"channels", channel, "messages", msgID));
        //Pin the Msg
        await pinGC(pid,channel,msgID, user.userID, user.name)
        const result= await getDoc(queryData);
        //Check that pinned is true
        expect(result.data().pinned).toBe(true);
    }, 10000);
    test("User can unpin a msg in GC", async () => {
        await  sendGC(pid,channel,msgID,user,text)
        const queryData = query(doc(db, "GCs", pid,"channels", channel, "messages", msgID));
        // Make sure it is pinned before trying to unpin
        await pinGC(pid,channel,msgID, user.userID, user.name)
        const msg= await getDoc(queryData);
        expect(msg.data().pinned).toBe(true);
        // Unpin the msg
        await unpinGC(pid,channel,msgID)
        const result= await getDoc(queryData);
        // Check the pinned is false
        expect(result.data().pinned).toBe(false);
        deleteDoc(doc(db, "GCs", pid,"channels", channel, "messages", msgID));
    }, 10000);
  });

  