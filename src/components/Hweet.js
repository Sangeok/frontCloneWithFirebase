import {useState} from "react";
import { dbService, storageService } from "myBase";
import {doc, collection, deleteDoc, updateDoc} from "firebase/firestore";
import { async } from "@firebase/util";
import { eventWrapper } from "@testing-library/user-event/dist/utils";
import { deleteObject,ref } from "firebase/storage";


function Hweet({hweetObj, isOwner}) {
    // editing mode인지를 판별
    const [editing, setEditing] = useState(false);
    // 수정된 text를 Update
    const [newHweet, setNewHweet] = useState(hweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete??");
        if(ok) {
            // 해당 글 삭제
            await deleteDoc(doc(dbService,"hweets",`${hweetObj.id}`));
            if(hweetObj.attachmentUrl !== "") {
                // image 삭제
                await deleteObject(ref(storageService, hweetObj.attachmentUrl));
            }
        }
        else {
            alert("error for deleting the text!!");
        }
    }
    const toggleEditing = () => {
        setEditing((prev)=>!prev);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService,"hweets",`${hweetObj.id}`), {
            text : newHweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setNewHweet(value);
    };

    return (
        <div >

            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="Edit your hweet!" value={newHweet} onChange={onChange} required/>
                            <input type="submit" value = "Update hweet"/>
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>
                            {hweetObj.text}
                        </h4>
                        {hweetObj.attachmentUrl && <img src={hweetObj.attachmentUrl} width="50px" height="50px"/>}
                        {/* 계정 주인 여부에 따라 button 생성 */}
                        {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete hweet</button>
                            <button onClick={toggleEditing}>Edit hweet</button>
                        </>
                        )}
                    </>
                )
            }
        </div>
    );
}

export default Hweet;