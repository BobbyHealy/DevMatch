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
import { addMS, sendToApprove, approveRequest, denyRequest, deleteMS } from "../fireStoreBE/Milestones";
const senderID = "jestUID"
const receiverID = "jestUID2"
const DMID = senderID +"-"+receiverID
const text = "This is jest Test"

const user ={
    userID: senderID,
    name: "JestName",
    profilePic: "https://www.nicepng.com/png/detail/73-730154_open-default-profile-picture-png.png"
}

describe("Milestone Test(User Story #6)", () => {
    const pid = "US6Test"
    const MSID = "US6MS"
    const title = "MSTEST"
    const assign = "US6"
    const label = "Frontend"
    const dueDate ="Tommorrow"

    test("Complete default as false", async () => {
        await createProject(pid)
        await addMS(pid,MSID,title,assign,dueDate,label)
        const queryData = query(doc(db, "Projects", pid, "MileStones", MSID));
        const milestone= await getDoc(queryData);
        expect(milestone.data().complete).toBe(false);
    }, 10000);

    test("Pending default as false", async () => {
        const queryData = query(doc(db, "Projects", pid, "MileStones", MSID));
        const milestone= await getDoc(queryData);
        expect(milestone.data().pending).toBe(false);
    }, 10000);

    test("Milestone can send to be pending review", async () => {
        await sendToApprove(pid, MSID)
        const queryData = query(doc(db, "Projects", pid, "MileStones", MSID));
        const milestone= await getDoc(queryData);
        expect(milestone.data().pending).toBe(true);
    }, 10000);

    test("Milestone is not mark as complete once rejected", async () => {
        await denyRequest(pid, MSID)
        const queryData = query(doc(db, "Projects", pid, "MileStones", MSID));
        const milestone= await getDoc(queryData);
        expect(milestone.data().pending).toBe(false);
        expect(milestone.data().complete).toBe(false);
    }, 10000);

    test("Milestone is removed from pending once rejected", async () => {
        const queryData = query(doc(db, "Projects", pid, "MileStones", MSID));
        const milestone= await getDoc(queryData);
        expect(milestone.data().pending).toBe(false);
    }, 10000);

    test("Milestone is mark as complete once approved", async () => {
        await sendToApprove(pid, MSID)
        await approveRequest(pid, MSID)
        const queryData = query(doc(db, "Projects", pid, "MileStones", MSID));
        const milestone= await getDoc(queryData);
        expect(milestone.data().complete).toBe(true);
       
    }, 10000);

    test("Milestone is removed from pending once approved", async () => {
        const queryData = query(doc(db, "Projects", pid, "MileStones", MSID));
        const milestone= await getDoc(queryData);
        expect(milestone.data().pending).toBe(false);
        deleteProject(pid)
    }, 10000);

    

});

describe("Pin and Unpin Test (User Story #7)", () => {
    const pid = "JestProj";
    const channel ="main"
    const msgID = "US7MSID";
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
    }, 100000);
    test("User can unpin a msg in DMs", async () => {
        await unpinMsg(DMID,msgID)
        const queryData = query(doc(db, "chats", DMID, "messages", msgID));
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

        // Unpin the msg
        await unpinGC(pid,channel,msgID)
        const queryData = query(doc(db, "Projects", pid,"TextChannels", channel, "messages", msgID));
        const msg= await getDoc(queryData);
        // Check the pinned is false
        await expect(msg.data().pinned).toBe(false);
        deleteProject(pid)
        
    }, 10000);
  });

  describe("Voice Channel Test (User Story #21)", () => {
    const pid = "US21Test"
    const channelVID = "US21"
    const vName = "US21"
    createProject(pid)
    test("User can create voice channels", async () => {
        await addVCChannel(pid,channelVID,vName)
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
        await deleteChannel(pid,channelVID)
        const queryData = query(doc(db, "Projects", pid,"VoiceChannels", channelVID));
        const vChannel= await getDoc(queryData);
        // channel is deleted
        await expect(vChannel.exists()).toBe(false)
        deleteProject(pid)
    }, 10000);
   
  });

  