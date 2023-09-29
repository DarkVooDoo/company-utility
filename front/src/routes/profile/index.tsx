import { component$ } from "@builder.io/qwik"
import { DocumentHead, Form, routeAction$, routeLoader$ } from "@builder.io/qwik-city"
import { BACKEND_HOST } from "~/lib/util"

import {Profile} from "~/lib/types"

import style from "./style.module.css"
import ButtonWithState from "~/components/ButtonWithState/component"

export const useGeUsertProfile = routeLoader$(async (req)=>{
    const token = req.cookie.get("auth-token")?.value
    if (token){
        const fetchProfile = await fetch(`${BACKEND_HOST}:5000/api/user`,{
            headers: [["Accept", "application/json"], ["Authorization", token]]
        })
        return await fetchProfile.json() as Profile
    }
    return {adresse: "", email: "", firstname: "", id: "", joined: "", lastname: "", postal: ""}
  })

export const useModifyProfile = routeAction$(async(form, req)=>{
    const token = req.cookie.get("auth-token")?.value
    const {firstname, lastname, adresse, postal} = form
    const user = {firstname, lastname, adresse, postal}
    if (token){
        const modifyUser = await fetch(`${BACKEND_HOST}:5000/api/user`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({...user})
        })
        if (modifyUser.status === 200){
            return await modifyUser.json() as Profile
        }
    }
})

const Profile = component$(()=>{
    const modifyProfile = useModifyProfile()
    const prof = useGeUsertProfile()
    return (
        <div>
            <h3 class={style.profile_header}>Personal info </h3>
            <Form action={modifyProfile}>
                <div class={style.profile_input}>
                    <label class={style.profile_input_label} form="firstname">Prenom</label>
                    <input class={style.profile_input_ele} required type="text" name="firstname" id="firstname" autoComplete="off" value={prof.value.firstname} />
                </div>
                <div class={style.profile_input}>
                    <label class={style.profile_input_label} form="lastname">Nom</label>
                    <input class={style.profile_input_ele} required type="text" name="lastname" id="lastname" autoComplete="off" value={prof.value.lastname} />
                </div>
                <div class={style.profile_input}>
                    <label class={style.profile_input_label} form="adresse">Adresse</label>
                    <input class={style.profile_input_ele} required type="text" name="adresse" id="adresse" autoComplete="off" value={prof.value.adresse} />
                </div>
                <div class={style.profile_input}>
                    <label class={style.profile_input_label} form="postal">Postal</label>
                    <input class={style.profile_input_ele} required type="number" name="postal" id="postal" autoComplete="off" value={prof.value.postal} />
                </div>
                {/* <button class={style.button} type="submit" disabled={modifyProfile.isRunning ? true : false}>Modifier {modifyProfile.isRunning && <Loading alt="loading" class={style.btn_loading} />}</button> */}
                <ButtonWithState {...{className: style.button, state: modifyProfile.isRunning, text: "Modifier", type: "submit"}} />
                {/* {notification && <PopupAlert {...{...notification, onAnimationEnd: ()=>{
                    setNotification(undefined)
                }}} />} */}
            </Form>
        </div>
    )
})

export const head:DocumentHead = {
    title: "Profile"
}

export default Profile