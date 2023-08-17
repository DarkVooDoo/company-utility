"use client"
import { FormEventHandler, useRef, useState } from "react"
import Image from "next/image"
import close from "@/public/close.svg"
import style from "./style.module.css"
import { GetCookie } from "@/util/lib"
import { useRouter } from "next/navigation"

interface Props{
    companyId: string,
    members: {
        id: string
        name: string,
        role: string
    }[]
}

const Actions:React.FC<Props> = ({members, companyId})=>{
    const router = useRouter()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [email, setEmail] = useState("")
    const [allMembers, setAllMembers] = useState(members)

    const onNewMember:FormEventHandler = async (e)=>{
        e.preventDefault()
        const token = GetCookie("auth-token")
        if(token){
            const addMember = await fetch(`http://localhost:5000/api/member`,{
                method: "POST",
                headers: [["Content-Type", "application/json"], ["Authorization", token]],
                body: JSON.stringify({email, companyId, role: "User"})
            })
            if (addMember.status === 200) {
                const newMember = await addMember.json()
                setAllMembers(members=>([...members, {id: newMember.id, name: newMember.name, role: newMember.role}]))
            }
        }
    }

    const onDeleteMember = async(id: string)=>{
        const token = GetCookie("auth-token")
        if (token){
            const deleteMember = await fetch(`http://localhost:5000/api/member`,{
                method: "DELETE",
                headers: [["Content-Type", "application/json"], ["Authorization", token]],
                body: JSON.stringify({id, companyId})
            })
            if (deleteMember.status === 200) {
                setAllMembers([...allMembers.filter(member=>member.id != id)])
            }
        }
    }

    const member = allMembers.map(member=>(
        <div key={member.id} className={style.dialog_member}>
            <p>{member.name} </p>
            <p>{member.role} </p>
            {member.role !== "Boss" && <button className={style.dialog_member_deleteBtn} onClick={()=>onDeleteMember(member.id)}><Image src={close} alt="close" className={style.dialog_member_deleteBtn_icon} /></button>}
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
                <form onSubmit={onNewMember} className={style.dialog_email}>
                    <input type="text" name="email" id="email" autoComplete="off" placeholder="Nouveau employé email" className={style.dialog_email_input} value={email} onChange={({currentTarget:{value}})=>{
                        setEmail(value)
                    }} />
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