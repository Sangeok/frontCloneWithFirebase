import { Router, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth.js"
import Home from "../routes/Home.js"
import {useState} from "react";
import Navigation from "./Navigation.js";
import Profile from "../routes/Profile.js"

function RouterWeb({isLoggedIn}) {
    return (
        <>
            {isLoggedIn && <Navigation />}
            <Routes>
            {
                isLoggedIn ? (
                    <>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                    </>
                )
                : // true는 위 false는 아래 실행(로그인 되었는가 여부)
                    <Route path="/" element={<Auth/>}/>
            }
            </Routes>
        </>
    )
}

export default RouterWeb;