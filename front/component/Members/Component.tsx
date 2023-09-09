"use client"
import {useEffect, useRef, useState } from "react"
import Image from "next/image"

import close from "@/public/close.svg"

import {onDeleteMember, onNewMember} from "@/app/actions"
import { GetCookie, closeDialogOnBackdropClick } from "@/util/lib"
import style from "./style.module.css"

interface Props{
    members: {
        id: string
        name: string,
        role: string
    }[]
}

const Actions:React.FC<Props> = ({members})=>{
    const dialogRef = useRef<HTMLDialogElement>(null)
    
    useEffect(()=>{
        if(dialogRef.current) closeDialogOnBackdropClick(dialogRef.current)
    }, [])

    const member = members.map(member=>(
        <div key={member.id} className={style.dialog_member}>
            <p>{member.name} </p>
            <p>{member.role} </p>
            {member.role !== "Boss" && 
                <form action={onDeleteMember}>
                    <button name="delete" value={member.id} className={style.dialog_member_deleteBtn} onClick={()=>{
                        members = [...members.filter(myMember=>member.id != myMember.id)]
                    }}><Image src={close} alt="close" className={style.dialog_member_deleteBtn_icon} /></button>
                </form>}
        </div>
    ))
    return (
        <div>
            <button type="button" onClick={()=>{
                dialogRef.current?.showModal()
            }} className={style.dashboard_membersBtn_link}> Mes Employés</button>
            <dialog ref={dialogRef} className={style.dialog}>
                <h1 className={style.dialog_header}>Employés <button type="button" className={style.dialog_close} onClick={()=>{
                    dialogRef.current?.close()
                }}><Image src={close} alt="Fermer" style={{width: "100%", height: "100%"}} /> </button></h1>
                <form action={async (formData)=>{
                    const newUser = await onNewMember(formData)
                }} className={style.dialog_email}>
                    <input type="text" name="email" id="email" autoComplete="off" placeholder="Nouveau employé email" className={style.dialog_email_input} />
                </form>
                <div className={style.dialog_member}>
                    <h3>Name</h3>
                    <h3>Role</h3>
                </div>
                <div className={style.dialog_member_container}>
                    {member}
                </div>
            </dialog>
        </div>
    )
}

export default Actions