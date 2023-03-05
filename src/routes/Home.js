import {useEffect, useState} from "react";
import { dbService, storageService } from "myBase";
// uuid = 어떤 특별한 식별자를 랜덤으로 생성
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, getDoc, getDocs, onSnapshot  } from "firebase/firestore";
import Hweet from "../components/Hweet.js";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

function Home({userObj}) {
    const [hweet, setHweet] = useState("");
    const [hweets, setHweets] = useState([]);
    const [attachment, setAttachment] = useState("");
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
        let attachmentUrl = "";
        // file Ref
        if(attachment !== "") {
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(fileRef,attachment,"data_url");
            // 파일의 url을 getDownload
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const hweeObj = {
            text : hweet,
            createAt : Date.now(),
            creatorId : userObj.uid,
            attachmentUrl
        }
        const getDoc = await addDoc(dbRef,hweeObj);
        setHweet("");
        // img 미리보기 비움
        setAttachment("");
    };

    const onChange = (event) => {
        const {target:{value}} = event;
        setHweet(value);
    };

    const onFileChange = (event) => {
        // event의 target에서 file을 받아오는 것을 의미
        const {target:{files}} = event;
        // 하나의 file을 불러왔음
        const theFile = files[0];
        const reader = new FileReader();
        // file을 불러오는 것이 끝나면 finishedEvent를 받아옴
        reader.onloadend = (finishedEvent) => {
            // finishedEvent의 currentTarget에서 result를 받아옴
            const {currentTarget :{result}} = finishedEvent;
            setAttachment(result);
        }
        // file reader를 통해 해당 file을 불러옴
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => {
        setAttachment("");
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input value={hweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={100}/>
                <input onChange={onFileChange} type="file" accept="image/*"/>
                <input type="submit" value = "hweet"/>
                {attachment && 
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                }
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