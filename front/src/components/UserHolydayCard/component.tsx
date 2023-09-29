import { CSSProperties, component$, $ } from "@builder.io/qwik"
import {useNavigate } from "@builder.io/qwik-city"

import { Holyday, ROLE } from "~/lib/types"
import Close from "~/media/close.svg?jsx"

import style from "./style.module.css"
import { BACKEND_HOST } from "~/lib/util"

interface Props{
    holyday: Holyday
    role: {
        id: string
        role: ROLE
    }
}

const UserHolydayCard = component$<Props>(({holyday, role: r})=>{
    const nav = useNavigate()

    const onDeleteHolyday = $(async ()=>{
        const del = await fetch(`${BACKEND_HOST}:5000/api/holyday`, {
            method: "DELETE",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({id: holyday.id})
        })
        if (del.status === 200){
            nav(undefined, {forceReload: true})
        }
    })

    const onRejectHolyday = $(async()=>{
        const reject = await fetch(`${BACKEND_HOST}:5000/api/holyday`, {
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({id: holyday.id, type: "reject"})
        })
        if (reject.status === 200){
            nav(undefined, {forceReload: true})
        }
    })

    const onAcceptHolyday = $(async()=>{
        const accept = await fetch(`${BACKEND_HOST}:5000/api/holyday`, {
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({id: holyday.id, type: "accept"})
        })
        if (accept.status === 200){
            nav(undefined, {forceReload: true})
        }
    })

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
        <>
            {/* <ConfirmAction {...{action: onDeleteHolyday, name: "id", value: holyday.id, isOpen: deleteAction, displayText: "Voulez-vous supprimer votre demande de congé?"}} /> */}
            <div class={style.holyday_content}>
                <Close alt="x" class={style.holyday_content_deleteBtn} onClick$={onDeleteHolyday} />
                <h3 class={style.holyday_content_name}>{holyday.name} </h3>
                <p class={style.holyday_content_ago}>Il y a {holyday.time} </p>
                <p class={style.holyday_content_date}>Du {holyday.from} Au {holyday.to} </p>
                <div class={style.holyday_content_status}>
                    <div class={style.holyday_content_status_bubble} style={statusBubbleColor} /><p>{holyday.status} </p>
                </div>
                {r.role !== "User" && <div class={style.holyday_content_controls}>
                    <button class={style.holyday_content_controls_rejectBtn} onClick$={onRejectHolyday}>Refusé</button>
                    <button class={style.holyday_content_controls_acceptBtn} onClick$={onAcceptHolyday}>Accepté</button>
                </div>}
            </div>
        </>
    )
})

export default UserHolydayCard