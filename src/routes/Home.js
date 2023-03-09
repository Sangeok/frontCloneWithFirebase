import {useEffect, useState} from "react";
import { dbService, storageService } from "myBase";
// uuid = 어떤 특별한 식별자를 랜덤으로 생성
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, getDoc, getDocs, onSnapshot  } from "firebase/firestore";
import Hweet from "../components/Hweet.js";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import HweetsFactory from "components/HweetsFactory.js";

function Home({userObj}) {
    const [hweets, setHweets] = useState([]);
    const dbRef = collection(dbService,"hweets");

    useEffect(()=>{
        // getNweets();
        // 실시간으로 firebase의 docs를 가져옴
        onSnapshot(dbRef, docsSap=>{
            const hweetArray = docsSap.docs.map((doc)=>({
                id : doc.id,
                ...doc.data(),
            }));
            setHweets(hweetArray);
        })
    }, []);

    return (
        <>
            <HweetsFactory userObj={userObj}/>
            <div>
                {hweets.map((hweet)=>(
                    <Hweet 
                        key={hweet.id} 
                        hweetObj={hweet} 
                        isOwner={hweet.creatorId===userObj.uid}
                    />
                ))}
            </div>
        </>

    )
}

export default Home;