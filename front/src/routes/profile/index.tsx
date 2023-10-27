import { component$, useSignal } from "@builder.io/qwik"
import { DocumentHead, Form, routeAction$, routeLoader$ } from "@builder.io/qwik-city"
import { BACKEND_HOST, CdnPrefix } from "~/lib/util"

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
    return {adresse: "", email: "", firstname: "", id: "", joined: "", lastname: "", birth: "", postal: "", photo: ""}
  })

export const useModifyProfile = routeAction$(async(form, req)=>{
    const token = req.cookie.get("auth-token")?.value
    if (token){
        const modifyUser = await fetch(`${BACKEND_HOST}:5000/api/user`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({...form})
        })
        if (modifyUser.status === 200){
            return await modifyUser.json() as Profile
        }
    }
})

export const useChangeAvatar = routeAction$(async(form, req)=>{
    const {photo, photoId} = form
    const formData = new FormData()
    const token = req.cookie.get("auth-token")?.value
    formData.append("photo", photo as any)
    formData.append("photoId", photoId as string)
    if (token){
        const t = await fetch(`${BACKEND_HOST}:5000/api/user`,{
            method: "PATCH",
            headers: [["Authorization", token]],
            body: formData
        })
    }
})

const Profile = component$(()=>{
    const modifyProfile = useModifyProfile()
    const prof = useGeUsertProfile()
    const picProfile = useSignal(prof.value.photo !== "" ? CdnPrefix+"profile/"+prof.value.photo : undefined)
    const changeAvatar = useChangeAvatar()
    return (
        <div>
            <h3 class={style.profile_header}>Personal info </h3>
            <div class={style.profile_photo}>
                <label for="photo" class={style.profile_photo_label} >Change Photo</label>
                <input type="file" name="photo" id="photo" accept="image/*" class={style.profile_photo_input} onChange$={async (e)=>{
                    const formData = new FormData()
                    const file = e.target.files?.item(0)
                    if (file && file.size <= 10000){
                        const fReader = new FileReader()
                        fReader.onload = (e)=>{
                            const result = e.target?.result
                            if (result) picProfile.value = result.toString()
                        }
                        fReader.readAsDataURL(file)
                        formData.append("photo", file as File)
                        formData.append("photoId", prof.value.photo)
                        await changeAvatar.submit(formData)
                    }
                }}/>
                {picProfile.value ? <img class={style.profile_photo_container} src={picProfile.value} alt="test" /> : null }
            </div>
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
                <div class={style.profile_input}>
                    <label class={style.profile_input_label} form="birth">Date de naissance</label>
                    <input class={style.profile_input_ele} required type="date" name="birth" id="birth" value={prof.value.birth} />
                </div>
                {/* <button class={style.button} type="submit" disabled={modifyProfile.isRunning ? true : false}>Modifier {modifyProfile.isRunning && <Loading alt="loading" class={style.btn_loading} />}</button> */}
                <ButtonWithState {...{clasStyle: style.button, state: modifyProfile.isRunning, text: "Modifier", type: "submit"}} />
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