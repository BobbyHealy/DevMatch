import { auth, db } from "../config/firebase";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { v4 } from "uuid";
const email = "jesttestemail@jesttestemail.com";
const password = "123456";

describe("Authenticaion Tests (User Story #1)", () => {
  test("Create new account with fake email and password", async () => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    expect(result.user.email).toBe(email);
    signOut(auth);
  });

  test("Login to newly created account and sign out", async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    expect(result.user.email).toBe(email);
    signOut(auth);
  });

  test("Delete account", async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    expect(result.user.email).toBe(email);
    result.user.delete();
  });
});

describe("Documents Tests (User Story #3)", () => {
  const docID = v4();
  const data = {
    fileName: "Example File",
    time: serverTimestamp(),
    lastEdit: serverTimestamp(),
  };
  test("Create a doc", async () => {
    setDoc(doc(db, "userDocs", email, "docs", docID), data)
      .then(() => {
        expect(email).toBe(email);
      })
      .catch((e) => {
        fail("it should not reach here");
        console.log(e);
      });
  }, 10000);

  test("Dock matches the created doc", async () => {
    const queryData = query(collection(db, "userDocs", email, "docs"));
    const querySnapshot = await getDocs(queryData);
    expect(querySnapshot.docs[0].data().fileName).toBe(data.fileName);
  }, 10000);

  test("Delete dock", async () => {
    deleteDoc(doc(db, "userDocs", email, "docs", docID))
      .then(() => {
        expect(email).toBe(email);
      })
      .catch((e) => {
        console.log(e);
        console.log("Hey");
        fail("it should not reach here");
      });
  }, 10000);
});
