"use client"

import style from "@/app/profile/profile.module.css"
import { FormEvent, useContext, useState } from "react"
import { userContext } from "./UserContext"
import { useRouter } from "next/navigation"
import { GetCookie } from "@/util/lib"


const NewCompany= ()=>{
    const router = useRouter()
    const [user] = useContext(userContext)
    const [info, setInfo] = useState({name: "", adresse: "", postal: 75002})
    const onCreateCompany = async (e:FormEvent)=>{
        e.preventDefault()
        const token = GetCookie("auth-token")
        if (token){
            const createCompany = await fetch(`http://localhost:5000/api/pro`,{
                method: "POST",
                headers: [["Content-Type", "application/json"], ["Authorization", token]],
                body: JSON.stringify({...info, id: user.user_id})
            })
            if (createCompany.status === 200){
                router.refresh()
            }
        }
    }
    return (
        <form onSubmit={onCreateCompany}>
            <h2>Nouvelle Enreprise</h2>
            <div className={style.input}>
                <input className={style.input_ele} required type="text" name="name" id="name" autoComplete="off" value={info.name}
                onChange={({currentTarget:{value}})=>setInfo(lastInfo=>({...lastInfo, name: value}))} />
                <label className={style.input_label} htmlFor="name">Nom</label>
            </div>
            <div className={style.input}>
                <input className={style.input_ele} required type="text" name="adresse" id="adresse" autoComplete="off" value={info.adresse}
                onChange={({currentTarget:{value}})=>setInfo(lastInfo=>({...lastInfo, adresse: value}))} />
                <label className={style.input_label} htmlFor="name">Adresse</label>
            </div>
            <div className={style.input}>
                <input className={style.input_ele} required type="number" name="postal" id="postal" autoComplete="off" value={info.postal} 
                onChange={({currentTarget:{value}})=>setInfo(lastInfo=>({...lastInfo, postal: parseInt(value)}))} />
                <label className={style.input_label} htmlFor="postal">Postal</label>
            </div>
            <div style={{display: "flex", justifyContent: "flex-end"}}>
                <button type="submit" className={style.button} onClick={onCreateCompany}>Creer</button>
            </div>
        </form>
    )
}

export default NewCompany