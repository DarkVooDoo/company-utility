"use client"

import { ChangeEventHandler, FormEventHandler, useEffect, useRef, useState } from "react"

import style from "./style.module.css"
import { GetCookie, closeDialogOnBackdropClick } from "@/util/lib"
import Calendar from "../Calendar"

const INFOS = {
    paye: `Vous bénéficiez des congés payés quel que soit votre contrat de travail 
    (CDI: CDI : Contrat de travail à durée indéterminée, CDD: CDD : Contrat à durée déterminée ou contrat d'intérim).`,
    maternite: `Vous êtes salariée en activité et vous êtes enceinte ? Vous bénéficiez d'un congé de maternité qui comporte une période avant 
    votre accouchement (dit congé prénatal) et une période après votre accouchement (dit congé postnatal).`
}

const Holydays = ()=>{
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [holydayType, setHolydayType] = useState("Classic")

    const onHolydayTypeChange:ChangeEventHandler<HTMLInputElement> = ({currentTarget:{value}})=>{
        setHolydayType(value)
    }

    const onHolydaysRequest:FormEventHandler = async(e)=>{
        e.preventDefault()
        const token = GetCookie("auth-token")
        if(token){
            const sendHolydayRequest = await fetch(`http://localhost:5000/api/holyday`,{
                method: "POST",
                headers: [["Content-Type", "application/json"], ["Authorization", token]],
                body: JSON.stringify({from: "2023-04-05", to: "2023-06-10", companyId: "lulhere"})
            })

        }
    }

    useEffect(()=>{
        closeDialogOnBackdropClick(dialogRef.current!!)
    },[])
    return (
        <div className={style.holyday}>
            <div className={style.holyday_header}>
                <h1 className={style.holyday_header_text}>Congés</h1>
                <button type="button" className={style.holyday_header_btn} onClick={()=>{
                    dialogRef.current!!.showModal()
                }} >Demander un congé</button>
            </div>
            <div className={style.holyday_nocontent}>
                Vous avez aucun congé
            </div>
            <dialog ref={dialogRef} className={style.holyday_dialog}>
                <form onSubmit={onHolydaysRequest}>
                    <div className={style.holyday_dialog_radio}>
                        <input type="radio" name="holyday" id="conge-payé" checked value={"Classic"} onChange={onHolydayTypeChange} />
                        <p>Congé Payé <button className={style.holyday_dialog_radio_infoBtn} data-title={INFOS.paye}>!</button></p>
                    </div>
                    <div className={style.holyday_dialog_radio}>
                        <input type="radio" name="holyday" id="maternité" value={"Maternite"} onChange={onHolydayTypeChange} />
                        <p>Maternité <button className={style.holyday_dialog_radio_infoBtn} data-title={INFOS.maternite}>!</button></p>
                    </div>
                    <button type="submit" className={style.holyday_dialog_sendBtn}>Envoyer</button>
                </form>
            </dialog>
        </div>
    )
}

export default Holydays