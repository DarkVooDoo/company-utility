"use client"

import { CSSProperties, ChangeEventHandler, FormEventHandler, useEffect, useRef, useState } from "react"

import style from "./style.module.css"
import { GetCookie, closeDialogOnBackdropClick } from "@/util/lib"
import Calendar from "../Calendar"
import { Holyday } from "@/util/type"

const INFOS = {
    paye: `Vous bénéficiez des congés payés quel que soit votre contrat de travail 
    (CDI: CDI : Contrat de travail à durée indéterminée, CDD: CDD : Contrat à durée déterminée ou contrat d'intérim).`,
    maternite: `Vous êtes salariée en activité et vous êtes enceinte ? Vous bénéficiez d'un congé de maternité qui comporte une période avant 
    votre accouchement (dit congé prénatal) et une période après votre accouchement (dit congé postnatal).`
}

interface Props{
    holydays: Holyday[]
}

const Holydays:React.FC<Props> = ({holydays = []})=>{
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [holydayType, setHolydayType] = useState<string>()
    const [dates, setDates] = useState<string[]>([])

    const onHolydayTypeChange:ChangeEventHandler<HTMLInputElement> = ({target:{value}})=>{ 
        setHolydayType(value)
    }

    const onHolydaysRequest:FormEventHandler = async(e)=>{
        e.preventDefault()
        const token = GetCookie("auth-token")
        const companyId = GetCookie("company-id")
        if(token && companyId && holydayType){
            const sendHolydayRequest = await fetch(`http://localhost:5000/api/holyday`,{
                method: "POST",
                headers: [["Content-Type", "application/json"], ["Authorization", token]],
                body: JSON.stringify({from: dates[0], to: dates[1], companyId: companyId, type: holydayType})
            })

        }
    }

    useEffect(()=>{
        closeDialogOnBackdropClick(dialogRef.current!!)
    },[])

    const dayOff = holydays.map(holyday=>{
        let statusBubbleColor:CSSProperties
        switch(holyday.status){
            case "Validé":
                statusBubbleColor = {backgroundColor: "greenyellow"}
                break
            case "Refusé":
                statusBubbleColor = {backgroundColor: "red"}
                break
            default :
                statusBubbleColor = {backgroundColor: "orange"}
                break
        }
        return (
            <div key={holyday.id} className={style.holyday_content}>
                <p>Du {holyday.from} Au {holyday.to} </p>
                <div className={style.holyday_content_status}>
                    <div className={style.holyday_content_status_bubble} style={statusBubbleColor} /><p>{holyday.status} </p>
                </div>
            </div>
        )
    })

    return (
        <div className={style.holyday}>
            <div className={style.holyday_header}>
                <h1 className={style.holyday_header_text}>Congés</h1>
                <button type="button" className={style.holyday_header_btn} onClick={()=>{
                    dialogRef.current!!.showModal()
                }} >Demander un congé</button>
            </div>
            {dayOff.length > 0 ? <>{dayOff} </> : <div className={style.holyday_nocontent}>
                Vous avez aucun congé
            </div>}
            <dialog ref={dialogRef} className={style.holyday_dialog}>
                <form onSubmit={onHolydaysRequest} className={style.holyday_dialog_form}>
                    <div className={style.holyday_dialog_radio}>
                        <input type="radio" name="holyday" id="conge-payé" value={"Congé Payé"} onChange={onHolydayTypeChange} />
                        <p>Congé Payé <button className={style.holyday_dialog_radio_infoBtn} data-title={INFOS.paye}>!</button></p>
                    </div>
                    <div className={style.holyday_dialog_radio}>
                        <input type="radio" name="holyday" id="maternité" value={"Matérnite"} onChange={onHolydayTypeChange} />
                        <p>Maternité <button className={style.holyday_dialog_radio_infoBtn} data-title={INFOS.maternite}>!</button></p>
                    </div>
                    <button type="submit" className={style.holyday_dialog_sendBtn}>Envoyer</button>
                    <Calendar {...{currentUser: "", type: "between", onChange: (date)=>{
                        setDates(date)
                    }}} />
                </form>
            </dialog>
        </div>
    )
}

export default Holydays