import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../config/firebase'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>({})
  const [loading, setLoading] = useState(true)
  console.log(userInfo)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
        updateCurrentUserInfo(user.uid);
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    setUser(null)
    setUserInfo(null)
    await signOut(auth)
  }

  const updateCurrentUserInfo = async (uid) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "userID": uid
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/api/getUser", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setUserInfo(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateCurrentUserInfo, userInfo}}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}