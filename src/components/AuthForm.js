import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,} from "firebase/auth";

function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target : {name, value}} = event;
        if(name === "email") {
            setEmail(value);
        }
        else if(name === "password") {
            setPassword(value);
        }
    }
    
    const onSubmit = async (event) => {
        const auth = getAuth();
        event.preventDefault();
        let data;
        // https://firebase.google.com/docs/auth/web/password-auth?hl=ko#web-version-9
        try {
            if(newAccount) {
                // Create new Account
                data = await createUserWithEmailAndPassword(auth, email, password);
            }
            else {
                // Log in
                data = await signInWithEmailAndPassword(auth, email, password);
            }
            console.log(data);
        }
        catch(error) {
            setError(error.message);
        }
    }

    const toggleAccount = () => {
        setNewAccount(prev=>!prev);
    }
    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                    name ="email" 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={email}
                    onChange={onChange}
                />
                <input 
                    name = "password" 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password}
                    onChange={onChange}
                />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"}/>
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
        </>
    )
}

export default AuthForm;