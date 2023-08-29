"use client"
import { Holyday } from "@/util/type"
import { CSSProperties } from "react"

import style from "./style.module.css"
import { BACKEND_HOST, ROLE } from "@/util/lib"
import { onAcceptHolyday, onRejectHolyday } from "@/app/actions"

interface Props{
    holyday: Holyday
    role: ROLE
}


const UserHolydayCard:React.FC<Props> = ({holyday, role})=>{

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
        <div className={style.holyday_content}>
            <h3 className={style.holyday_content_name}>John Doe </h3>
            <p className={style.holyday_content_ago}>Il y a {holyday.time} </p>
            <p className={style.holyday_content_date}>Du {holyday.from} Au {holyday.to} </p>
            <div className={style.holyday_content_status}>
                <div className={style.holyday_content_status_bubble} style={statusBubbleColor} /><p>{holyday.status} </p>
            </div>
            {role !== "User" && <div className={style.holyday_content_controls}>
                <form action={onRejectHolyday}>
                    <button type="submit" className={style.holyday_content_controls_rejectBtn} name="id" value={holyday.id} >Refusé</button>
                </form>
                <form action={onAcceptHolyday}>
                    <button type="submit" className={style.holyday_content_controls_acceptBtn} name="id" value={holyday.id}>Accepté</button>
                </form>
            </div>}
        </div>
    )
}


export default UserHolydayCard