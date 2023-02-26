import { useState } from "react";
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

function Auth() {
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

    const onSocialClick = async (event) => {
        const auth = getAuth();
        const {target:{name}} = event;
        let provider;
        if(name === "google") {
            provider = new GoogleAuthProvider();
        }
        else if(name === "github") {
            provider = new GithubAuthProvider();
        }
        const result = await signInWithPopup(auth, provider);
        console.log(result);
    }

    return (
        <div>
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
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
            
        </div>
    )
}

export default Auth;