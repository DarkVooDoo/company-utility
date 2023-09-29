import { component$, useContext, useSignal } from "@builder.io/qwik"

import {BACKEND_HOST, userContext} from "~/lib/util"

import style from "./style.module.css"
import { DocumentHead, Form, routeAction$, useNavigate, z, zod$ } from "@builder.io/qwik-city";

export const useSigninAction = routeAction$(async (form, request)=>{
    const {email, password, lastname, confirmation, firstname} = form
    if (confirmation && confirmation === password){
        const createUser = await fetch(`${BACKEND_HOST}:5000/api/user`, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({email: email, password: password, firstname: firstname, lastname: lastname})
        })
    }else{
        const signUser = await fetch(`${BACKEND_HOST}:5000/api/auth`, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({email: email, password: password})
        })
        if(signUser.status === 200){
            const userCredential = await signUser.json()
            request.cookie.set("auth-token", userCredential.user_token, {maxAge: 60*60*5, path: "/"})
            request.cookie.set("user_name", userCredential.user_name, {maxAge: 60*60*5, path: "/"})
            request.cookie.set("id", userCredential.user_id, {maxAge: 60*60*5, path: "/"})
            return {success: true, id: userCredential.user_id, name: userCredential.user_name}
        }
    }
}, zod$({firstname: z.string().optional(), lastname: z.string().optional(), email: z.string(), password: z.string(), confirmation: z.string().optional()}))

const Login = component$(()=>{
    const signinAction = useSigninAction()
    const nav = useNavigate()
    const [_, changeUser] = useContext(userContext)
    const isNewUser = useSignal(false)
     return (
        <div class={style.sign}>
            <Form class={style.sign_form} action={signinAction} onSubmitCompleted$={(e)=>{
                if(e.detail.status === 200){
                    changeUser(e.detail.value.id, e.detail.value.name)
                    nav("/home")
                }
            }}>
                <h1 style={{textAlign: "center"}}>Company</h1>
                <p class={style.sign_form_new}>{isNewUser ? "Connexion " : "Nouveau? "}
                    <button type="button" class={style.sign_form_newBtn} onClick$={()=>isNewUser.value = !isNewUser.value}>{isNewUser.value ? "Connectez-vous" : "Creer un compte"} </button>
                </p>
                {isNewUser.value && <> 
                    <div class={`${style.sign_input}`}>
                        <label for="prenom" class={style.sign_input_label}>Prenom</label>
                        <input type="text" name="firstname" id="prenom" autoComplete="off"
                        class={style.sign_input_field}  />
                    </div>
                    <div class={`${style.sign_input}`}>
                        <label form="nom" class={style.sign_input_label}>Nom</label>
                        <input type="text" name="lastname" id="nom" class={style.sign_input_field} autoComplete="off"
                         />
                    </div>
                </>}
                <div class={style.sign_input}>
                    <label form="email" class={style.sign_input_label}>Email</label>
                    <input type="text" name="email" id="email" class={style.sign_input_field} autoComplete="off"
                    />
                </div>
                <div class={style.sign_input}> 
                    <label form="password" class={style.sign_input_label}>Mot de passe</label>
                    <input type="password" name="password" id="password" class={style.sign_input_field}  />
                </div>
                {isNewUser.value ? <div class={`${style.sign_input}`}> 
                    <label form="confirmation" class={style.sign_input_label}>Confirmation</label>
                    <input type="password" name="confirmation" id="confirmation" class={style.sign_input_field}  />
                </div> : null}
                <p>Mot de passe oublié?</p>
                <div class={style.sign_button}>
                    <button type="submit" class={style.sign_button_sign}>Connexion</button>
                </div>
            </Form>
        </div>
    )
})

export const head:DocumentHead = {
    title: "Connexion"
}

export default Login