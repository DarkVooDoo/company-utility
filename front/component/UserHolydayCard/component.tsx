"use client"
import { Holyday, ROLE } from "@/util/type"
import { CSSProperties, useState } from "react"

import Image from "next/image"
import close from "@/public/close.svg"

import style from "./style.module.css"
import { onAcceptHolyday, onDeleteHolyday, onRejectHolyday } from "@/app/actions"
import ConfirmAction from "../ConfirmAction/component"

interface Props{
    holyday: Holyday
    role: {
        id: string
        role: ROLE
    }
}

const UserHolydayCard:React.FC<Props> = ({holyday, role: r})=>{
    let statusBubbleColor:CSSProperties
    const [deleteAction, setDeleteAction] = useState(false)
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
        <>
            <ConfirmAction {...{action: onDeleteHolyday, name: "id", value: holyday.id, isOpen: deleteAction, displayText: "Voulez-vous supprimer votre demande de congé?"}} />
            <div className={style.holyday_content}>
                <Image src={close} alt="x" className={style.holyday_content_deleteBtn} onClick={()=>setDeleteAction(prev=>!prev)} />
                <h3 className={style.holyday_content_name}>{holyday.name} </h3>
                <p className={style.holyday_content_ago}>Il y a {holyday.time} </p>
                <p className={style.holyday_content_date}>Du {holyday.from} Au {holyday.to} </p>
                <div className={style.holyday_content_status}>
                    <div className={style.holyday_content_status_bubble} style={statusBubbleColor} /><p>{holyday.status} </p>
                </div>
                {r.role !== "User" && <div className={style.holyday_content_controls}>
                    <form action={(formData)=>{
                        onRejectHolyday(formData, holyday.user)
                    }}>
                        <button type="submit" className={style.holyday_content_controls_rejectBtn} name="id" value={holyday.id} >Refusé</button>
                    </form>
                    <form action={(formData: FormData)=>{
                        onAcceptHolyday(formData, holyday.user)
                    }}>
                        <button type="submit" className={style.holyday_content_controls_acceptBtn} name="id" value={holyday.id}>Accepté</button>
                    </form>
                </div>}
            </div>
        </>
    )
}


export default UserHolydayCard