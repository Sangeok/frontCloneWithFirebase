import { Router, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth.js"
import Home from "../routes/Home.js"
import {useState} from "react";

function RouterWeb({isLoggedIn}) {

    return (
        <Routes>
            {
                isLoggedIn ?
                <Route path="/" element={<Home/>}/>
                  : // true는 위 false는 아래 실행(로그인 되었는가 여부)
                <Route path="/" element={<Auth/>}/>
            }
        </Routes>
    )
}

export default RouterWeb;