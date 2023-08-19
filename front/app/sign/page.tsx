"use client"
import { useContext, useState } from "react"
import style from "./Sign.module.css"
import { CreateCookie } from "@/util/lib"
import { userContext } from "@/component/UserContext"
import { useRouter } from "next/navigation"

const Sign = ()=>{
    const router = useRouter()
    const [_, onUserChange] = useContext(userContext)
    const [isNewUser, setIsNewUser] = useState(false)
    const [user, setUser] = useState({email: "", password: "", firstname: "", lastname: "", confirmation: ""})

    const onSignin = async ()=>{
        if (user.confirmation === user.password && isNewUser){
            const createUser = await fetch(`http://localhost:5000/api/user`, {
                method: "POST",
                headers: [["Content-Type", "application/json"]],
                body: JSON.stringify({email: user.email, password: user.password, firstname: user.firstname, lastname: user.lastname})
            })
            if(createUser.status === 200){
                router.push("/")
            }
        }else{
            const signUser = await fetch(`http://localhost:5000/api/auth`, {
                method: "POST",
                headers: [["Content-Type", "application/json"]],
                body: JSON.stringify({email: user.email, password: user.password})
            })
            if(signUser.status === 200){
                const userCredential = await signUser.json()
                onUserChange({user_id: userCredential.user_id, user_name: userCredential.user_name})
                CreateCookie("auth-token", userCredential.user_token, 60*60*24*3)
                CreateCookie("id", userCredential.user_id, 60*60*24*3)
                CreateCookie("user_name", userCredential.user_name, 60*60*24*3)
                router.push("/")
            }
        }
    }
    return (
        <main className={style.sign}>
            <div className={style.sign_form}>
                <h1 style={{textAlign: "center"}}>Company</h1>
                <p className={style.sign_form_new}>{isNewUser ? "Connexion " : "Nouveau? "}
                    <button type="button" className={style.sign_form_newBtn} onClick={()=>setIsNewUser(prev=>!prev)}>{isNewUser ? "Connectez-vous" : "Creer un compte"} </button>
                </p>
                {isNewUser && <> 
                    <div className={`${style.sign_input}`}>
                        <label htmlFor="prenom" className={style.sign_input_label}>Prenom</label>
                        <input type="text" name="prenom" id="prenom" autoComplete="off"
                        className={style.sign_input_field} onChange={({currentTarget:{value}})=>setUser({...user, firstname: value})} />
                    </div>
                    <div className={`${style.sign_input}`}>
                        <label htmlFor="nom" className={style.sign_input_label}>Nom</label>
                        <input type="text" name="nom" id="nom" className={style.sign_input_field} autoComplete="off"
                        onChange={({currentTarget:{value}})=>setUser({...user, lastname: value})} />
                    </div>
                </>}
                <div className={style.sign_input}>
                    <label htmlFor="email" className={style.sign_input_label}>Email</label>
                    <input type="text" name="email" id="email" className={style.sign_input_field} autoComplete="off"
                    onChange={({currentTarget:{value}})=>setUser({...user, email: value})} />
                </div>
                <div className={style.sign_input}> 
                    <label htmlFor="password" className={style.sign_input_label}>Mot de passe</label>
                    <input type="password" name="password" id="password" className={style.sign_input_field} onChange={({currentTarget:{value}})=>setUser({...user, password: value})} />
                </div>
                {isNewUser && <div className={`${style.sign_input}`}> 
                    <label htmlFor="confirmation" className={style.sign_input_label}>Confirmation</label>
                    <input type="password" name="confirmation" id="confirmation" className={style.sign_input_field} onChange={({currentTarget:{value}})=>setUser({...user, confirmation: value})} />
                </div>}
                <p>Mot de passe oublié?</p>
                <div className={style.sign_button}>
                    <button type="button" className={style.sign_button_sign} onClick={onSignin}>Connexion</button>
                </div>
            </div>
        </main>
    )
}

export default Sign