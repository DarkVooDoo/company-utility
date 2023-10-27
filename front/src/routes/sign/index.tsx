import { component$, useContext, useSignal, $, useVisibleTask$ } from "@builder.io/qwik"

import {BACKEND_HOST, CreateCookie, userContext} from "~/lib/util"

import style from "./style.module.css"
import { DocumentHead, Form, routeAction$, useNavigate, z, zod$ } from "@builder.io/qwik-city"

export const useSigninAction = routeAction$(async (form, request)=>{
    const {email, password, lastname, confirmation, firstname} = form
    if (confirmation && confirmation === password){
        await fetch(`${BACKEND_HOST}:5000/api/user`, {
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
            return {success: true, id: userCredential.user_id, name: userCredential.user_name, photo: userCredential.user_photo}
        }
    }
}, zod$({firstname: z.string().optional(), lastname: z.string().optional(), email: z.string(), password: z.string(), confirmation: z.string().optional()}))

const Login = component$(()=>{
    const signinAction = useSigninAction()
    const nav = useNavigate()
    const context = useContext(userContext)
    const isNewUser = useSignal(false)
    const googleRef = useSignal<HTMLButtonElement>()

    const onConnect = $(async (e:{credential: string})=>{
        const verifyGoogle = await fetch(`${BACKEND_HOST}:5000/api/auth`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["auth-type", "google"]],
            body: JSON.stringify({token: e.credential})
        })
        if(verifyGoogle.status === 200){
            const userCredential = await verifyGoogle.json()
            console.log(userCredential)
            CreateCookie("auth-token", userCredential.user_token, 60*60*5, "/")
            CreateCookie("user_name", userCredential.user_name, 60*60*5, "/")
            CreateCookie("id", userCredential.user_id, 60*60*5, "/")
            context[1](userCredential.user_id, userCredential.user_name, userCredential.user_photo)
            nav("/home")
        }
    })

    useVisibleTask$(()=>{
        (window as any).google.accounts.id.initialize({
            client_id: "432757696898-pbn4r01ut5ejpnrs342foham08ger5rp.apps.googleusercontent.com",
            callback: onConnect
          });
          if(googleRef.value){
              (window as any).google.accounts.id.renderButton(
                googleRef.value,
                { theme: "outline", size: "large", type: "icon" }  // customization attributes
              );
          }
          (window as any).google.accounts.id.prompt(); // also display the One Tap dialog
    })

     return (
        <div class={style.sign}>
            <Form class={style.sign_form} action={signinAction} onSubmitCompleted$={(e)=>{
                if(e.detail.status === 200){
                    context[1](e.detail.value.id, e.detail.value.name, e.detail.value.photo)
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
                    <button type="button" ref={googleRef}>Connect With google</button>
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