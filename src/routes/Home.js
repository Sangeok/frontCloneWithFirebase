import {useEffect, useState} from "react";
import { dbService } from "myBase";
import { addDoc, collection, getDoc, getDocs, onSnapshot  } from "firebase/firestore";
import Hweet from "../components/Hweet.js";

function Home({userObj}) {
    const [hweet, setHweet] = useState("");
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

    // snapshot과 동일한 방법
    // const getNweets = async() => {
    //     const dbhweets = await getDocs(dbRef);
    //     dbhweets.forEach((document)=> {
    //         const hweetObject = {
    //         ...document.data(),
    //         id : document.id,
    //     }
    //     setHweets((prev)=> [hweetObject, ...prev]);
    //     })
    // }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(dbRef, {
                text : hweet,
                createAt : Date.now(),
                creatorId : userObj.uid,
            });
            setHweet("");
        }
        catch(error) {
            alert(error);
        }
    };

    const onChange = (event) => {
        const {target:{value}} = event;
        setHweet(value);
    };
    return (
        <>
            <form onSubmit={onSubmit}>
                <input value={hweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={100}/>
                <input type="submit" value = "hweet"/>
            </form>
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