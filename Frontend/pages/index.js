import Login from "./account/login";
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
