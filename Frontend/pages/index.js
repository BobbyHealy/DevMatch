import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import ComponentTest from "./componentTest";
import Example from "./componentTest";
import ProfilePage from "./components/ProfilePage/ProfilePage.js"

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <ProfilePage/>;
}
