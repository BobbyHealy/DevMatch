import React from "react";
import PastUserComponent from "./PastUserComponent";
import { useAuth } from "@/context/AuthContext";

export default function PastUsers() {
    const { user } = useAuth();

    return (
        <div className="bg-gray-100 px-5 py-5">
            <p className="text-lg px-5 py-5 font-bold">You've previously worked with:</p>
            <PastUserComponent user={user}/>
        </div>
    );
}