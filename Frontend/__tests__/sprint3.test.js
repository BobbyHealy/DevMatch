import { db } from "../config/firebase";

import {
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { sendMsg, pinMsg, unpinMsg, deleteDM } from "../fireStoreBE/DMs";
import { sendMsg as sendGC, pinMsg as pinGC, unpinMsg as unpinGC} from "../fireStoreBE/GCText";
import { createProject, deleteProject } from "../fireStoreBE/Project";
import { addChannel as addVCChannel, deleteChannel} from "../fireStoreBE/GCVoice";
const senderID = "jestUID"
const receiverID = "jestUID2"
const DMID = senderID +"-"+receiverID
const msgID = uuid();
const text = "This is jest Test"
const pid = "JestProj";
const channel ="main"
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
        await pinMsg(DMID,msgID,senderID)
        const result= await getDoc(queryData);
        expect(result.data().pinned).toBe(true);
    }, 10000);
    test("User can unpin a msg in DMs", async () => {
        const msgIDU = "unpinMsg"

        // make sure it is pinned before unpin
        await sendMsg(DMID, msgIDU, senderID,receiverID, text)
        await pinMsg(DMID,msgIDU,senderID)
        // unpin the msg
        await unpinMsg(DMID,msgIDU)
        const queryData = query(doc(db, "chats", DMID, "messages", msgIDU ));
        const msg= await getDoc(queryData);
        expect(msg.data().pinned).toBe(false);
        deleteDoc(doc(db, "userChats",senderID ));
        deleteDoc(doc(db, "userChats", receiverID));
        deleteDM(DMID)
    }, 10000);
    test("Msgs in GC are default as unpin", async () => {
        createProject(pid)

        //send a messege in the Jest test GC
        await  sendGC(pid,channel,msgID,user,text)
        //Fetch the Msg in the GC
        const queryData = query(doc(db, "Projects", pid,"TextChannels", channel, "messages", msgID));
        const msg= await getDoc(queryData);
        //Check if pinned is false 
        expect(msg.data().pinned).toBe(false);
    }, 10000);
    test("User can pin a msg in GC", async () => {
        //Fetch the Msg in the GC
        const queryData = query(doc(db, "Projects", pid,"TextChannels", channel, "messages", msgID));
        //Pin the Msg
        await pinGC(pid,channel,msgID, user.userID, user.name)
        const result= await getDoc(queryData);
        //Check that pinned is true
        expect(result.data().pinned).toBe(true);
    }, 10000);
    test("User can unpin a msg in GC", async () => {
        const msgIDU = "unpinMsg"
        await  sendGC(pid,channel,msgIDU,user,text)

        // Make sure it is pinned before trying to unpin
        await pinGC(pid,channel,msgID, user.userID, user.name)

        // Unpin the msg
        await unpinGC(pid,channel,msgID)
        const queryData = query(doc(db, "Projects", pid,"TextChannels", channel, "messages", msgIDU));
        const msg= await getDoc(queryData);
        // Check the pinned is false
        await expect(msg.data().pinned).toBe(false);
        deleteProject(pid)
        
    }, 10000);
  });

  describe("Voice Channel Test (User Story #21)", () => {
    const pid21 = "US21Test"
    const channelVID = "US21"
    const vName = "US21"
    createProject(pid21)
    test("User can create voice channels", async () => {
        await addVCChannel(pid21,channelVID,vName)
        const queryData = query(doc(db, "Projects", pid,"VoiceChannels", channelVID));
        const vChannel= await getDoc(queryData);
        await expect(vChannel).toBeTruthy();

        

    }, 10000);
    test("User can fetch the correct voice channels data", async () => {
        const queryData = query(doc(db, "Projects", pid, "VoiceChannels", channelVID));
        const vChannel= await getDoc(queryData);
        // id is correct
        await expect(vChannel.id).toBe(channelVID);

    }, 10000);

    test("User can delete voice channel", async () => {
        await deleteChannel(pid21,channelVID)
        const queryData = query(doc(db, "Projects", pid,"VoiceChannels", channelVID));
        const vChannel= await getDoc(queryData);
        // channel is deleted
        await expect(vChannel.exists()).toBe(false)
        deleteProject(pid21)
    }, 10000);
   
  });

  