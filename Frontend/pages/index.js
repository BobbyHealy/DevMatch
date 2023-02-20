import Head from "next/head";
import Image from "next/image";
//import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import ComponentTest from "../components/componentTest";
import Example from "../components/componentTest";
import SignUp from "./account/signup";
import FollowUp from "./account/followup";

//const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <FollowUp></FollowUp>;
}
