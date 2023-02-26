import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

import ProfilePage from "./account/profile.js"
import ComponentTest from "../components/componentTest";
import Example from "../components/componentTest";
import Feed from "./feed";
import { useAuth } from "@/context/AuthContext";
import Router from "next/router";
import { useEffect } from "react";


// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { user } = useAuth();
  useEffect(() => {
    if (user !== null) {
      Router.push(`/`);
    } else {
      Router.push(`/account/login`);
    }
  }, [user]);

  return user !== null ? <Feed /> : <Login />;
}
