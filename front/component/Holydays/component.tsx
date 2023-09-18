"use client"

import { ChangeEventHandler, useEffect, useRef, useState } from "react"

import Image from "next/image"
import left from "@/public/left-arrow.webp"

import style from "./style.module.css"
import { closeDialogOnBackdropClick } from "@/util/lib"
import Calendar from "../Calendar"
import { Holyday } from "@/util/type"
import UserHolydayCard from "../UserHolydayCard/component"
import { onRequestHolyday } from "@/app/actions"

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

    useEffect(()=>{
        closeDialogOnBackdropClick(dialogRef.current!!)
    },[])
    const dayOff = holydays.map(holyday=><UserHolydayCard key={holyday.id} {...{holyday, role: {id: "0", role: "User"}}} />)

    return (
        <div className={style.holyday}>
            <div className={style.holyday_header}>
                <h1 className={style.holyday_header_text}>Congés</h1>
                <button type="button" className={style.holyday_header_btn} onClick={()=>{
                    dialogRef.current!!.showModal()
                }} >Demander un congé <Image src={left} alt="arrow" className={style.holyday_header_btn_arrow} /></button>
            </div>
            {dayOff.length > 0 ? <>{dayOff} </> : <div className={style.holyday_nocontent}>
                Vous avez aucun congé
            </div>}
            <dialog ref={dialogRef} className={style.holyday_dialog}>
                <form action={()=>{
                    onRequestHolyday(holydayType, dates)
                    dialogRef.current?.close()
                }} className={style.holyday_dialog_form}>
                    <div className={style.holyday_dialog_radio}>
                        <input type="radio" name="holyday" id="conge-payé" value={"Congé Payé"} onChange={onHolydayTypeChange} />
                        <p>Congé Payé <button className={style.holyday_dialog_radio_infoBtn} data-title={INFOS.paye}>!</button></p>
                    </div>
                    <div className={style.holyday_dialog_radio}>
                        <input type="radio" name="holyday" id="maternité" value={"Matérnite"} onChange={onHolydayTypeChange} />
                        <p>Maternité <button className={style.holyday_dialog_radio_infoBtn} data-title={INFOS.maternite}>!</button></p>
                    </div>
                    <button type="submit" className={style.holyday_dialog_sendBtn}>Envoyer</button>
                    <Calendar {...{currentUser: "",type: "between", onChange: (date)=>{
                        setDates(date)
                    }}} />
                </form>
            </dialog>
        </div>
    )
}

export default Holydays