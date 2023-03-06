import { async } from "@firebase/util";
import { updateProfile } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { authService, dbService } from "myBase";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile({userObj, refreshUser}) {
    useEffect(()=>{
        getMyHweets();
    }, [])
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        // logout 시 home으로 돌아감.
        navigate("/");
    }

    const onChange = (event) => {
        const {target:{value}} = event;
        setNewDisplayName(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        // 아무 변경사항 X시, Update를 X
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName : newDisplayName});
        }
        refreshUser();
    }

    const getMyHweets = async () => {
        // dbService의 Collection에서 hweets docs에서 userObj의
        // uid와 동일한 creatorId를 가진 모든 문서를 내림차순으로
        // 가져오는 쿼리(요청) 생성
        const q = query(
            collection(dbService,'hweets'),
            where('creatorId','==',`${userObj.uid}`),
            orderBy("createdAt","desc"));
        const unsubscribe = await onSnapshot(q,(snapshot)=>{
            const newArray = snapshot.docs.forEach((doc)=>{
                return ({id:doc.id, ...doc.data()})
            })
        })
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} value={newDisplayName} type="text" placeholder="Display name"/>
                <input type="submit" value="Update Profile"/>
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}
export default Profile;