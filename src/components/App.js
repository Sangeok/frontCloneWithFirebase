import RouterWeb from "./RouterWeb.js";
import {useEffect, useState} from "react";
// jsconfig로 인해 이런식으로 import가 가능해짐.
import { authService } from "../myBase";

function App() {
  const [init, setInit] = useState(false);
  // useState가 유저의 로그인 여부를 알 수 있게 됨.(true,false로 저장됨)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // 사용자의 로그인 상태 변경에 대한 관찰자를 추가
  useEffect(()=> {
    authService.onAuthStateChanged((user)=>{
      if(user) {
        setIsLoggedIn(true);
        setUserObj(user);
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])

  return (
    <div className="App">
      {init ? <RouterWeb isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
    </div>
  );
}

export default App;
