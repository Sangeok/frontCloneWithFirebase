import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import AuthForm from "components/AuthForm";

function Auth() {

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
            <AuthForm/>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
            
        </div>
    )
}

export default Auth;