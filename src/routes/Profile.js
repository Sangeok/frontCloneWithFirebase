import { authService } from "myBase";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        // logout 시 home으로 돌아감.
        navigate("/");
    }
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}

export default Profile;