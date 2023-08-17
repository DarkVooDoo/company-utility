"use client"
import style from "@/app/profile/profile.module.css"
import { Profile } from "@/util/data"
import { useState } from "react"
import PopupAlert from "./PopupAlert/Component"
import {revalidatePath} from "next/cache"

interface Props extends Profile{
}

const UserProfile:React.FC<Props> = (profile)=>{
    const [user, setUser] = useState(profile)
    const [notification, setNotification] = useState<{message: string, isSuccess: boolean} | undefined>()
    const onModifyUser = async ()=>{
        const modifyUser = await fetch(`http://localhost:5000/api/user`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({...user})
        })
        modifyUser.status === 200 ? setNotification({message: "Modifié", isSuccess: true}) : setNotification({message: "Error", isSuccess: false})
    }
    return (
        <>
            <div className={style.profile_input}>
                <label className={style.profile_input_label} htmlFor="firstname">Prenom</label>
                <input className={style.profile_input_ele} required type="text" name="firstname" id="firstname" autoComplete="off" value={user.firstname}
                onChange={({currentTarget:{value}})=>setUser(u=>({...u, firstname: value}))} />
            </div>
            <div className={style.profile_input}>
                <label className={style.profile_input_label} htmlFor="lastname">Nom</label>
                <input className={style.profile_input_ele} required type="text" name="lastname" id="lastname" autoComplete="off" value={user.lastname}
                onChange={({currentTarget:{value}})=>setUser(u=>({...u, lastname: value}))} />
            </div>
            <div className={style.profile_input}>
                <label className={style.profile_input_label} htmlFor="adresse">Adresse</label>
                <input className={style.profile_input_ele} required type="text" name="adresse" id="adresse" autoComplete="off" value={user.adresse}
                onChange={({currentTarget:{value}})=>setUser(u=>({...u, adresse: value}))} />
            </div>
            <div className={style.profile_input}>
                <label className={style.profile_input_label} htmlFor="postal">Postal</label>
                <input className={style.profile_input_ele} required type="number" name="postal" id="postal" autoComplete="off" value={user.postal}
                onChange={({currentTarget:{value}})=>setUser(u=>({...u, postal: value}))} />
            </div>
            <button className={style.button} type="button" onClick={onModifyUser}>Modifier</button>
            {notification && <PopupAlert {...{...notification, onAnimationEnd: ()=>{
                setNotification(undefined)
            }}} />}
        </>
    )
}

export default UserProfile