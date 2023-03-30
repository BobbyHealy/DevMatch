import { auth } from "../config/firebase";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

describe("Authenticaion Tests", () => {
  const email = "jesttestemail@jesttestemail.com";
  const password = "123456";
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

describe("Crazy Tests", () => {
  test("Create new account with fake email and password", async () => {
    const email = "jesttestemail@jesttestemail.com";
    const password = "123456";
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const email2 = "jesttestemail2@jesttestemail.com";
    const password2 = "123456";
    const result2 = await createUserWithEmailAndPassword(
      auth,
      email2,
      password2
    );

    expect(result.user.email).toBe(email);
    expect(result2.user.email).toBe(email2);
    result.user.delete();
    result2.user.delete();
  });
});
