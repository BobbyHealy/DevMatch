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
const email = "jesttestemail@jesttestemail.com";
const password = "123456";
const senderID = "jestUID"
const receiverID = "jestUID2"
const DMID = senderID +"-"+receiverID
const msgID = uuid();
const text = "This is jest Test"

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
        deleteDoc(doc(db, "chats", DMID, "messages", msgID));
    }, 10000);

  
  });

  