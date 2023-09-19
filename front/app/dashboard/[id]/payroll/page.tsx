"use client"

import style from "./style.module.css"

import { useEffect, useState } from "react"
import Calendar from "@/component/Calendar"

import Image from "next/image"
import trash from "@/public/trash.svg"

import { BACKEND_HOST, GetCookie } from "@/util/lib"
import { Member, Payroll } from "@/util/type"
import { onDeleteHour } from "@/app/actions"

const Payroll = ({params}: {params: {id: string}})=>{
    const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined)
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        (async ()=>{
            const companyId = params.id
            const token = GetCookie("auth-token")
            if (token){
                const fetchMember = await fetch(`${BACKEND_HOST}:5000/api/member?companyId=${companyId}`,{
                    headers: [["Authorization", token]],
                    next: {tags: ["test"]}
                })
                const memberResponse = await fetchMember.json() as Member[]
                setMembers(memberResponse)
                setLoading(false)
            }
        })()
    },[])

    if (loading) return <p>Loading...</p>
    const displayMember = members.map(member=><button key={member.id} className={style.payroll_top_names_btn} style={member.user_id === selectedUser ? {backgroundColor: "lightgray"} : {}} onClick={()=>setSelectedUser(member.user_id)}>{member.name} </button>)
    return (
        <main className={style.payroll}>
            <SelectDate {...{userId: selectedUser}}>
                <div className={style.payroll_top_names}>
                    {displayMember}
                </div>
            </SelectDate>
        </main>
    )
}

interface Props{
    userId: string | undefined
    children: React.ReactNode
}

const SelectDate:React.FC<Props> = ({userId, children})=>{
    const [employees, setEmployees] = useState<Payroll>()
    const [[from, to], setDate] = useState<string[]>([])
    useEffect(()=>{
        (async ()=>{
             if (from && to && userId){
                const companyId = GetCookie("company-id")
                 const getHours = await fetch(`${BACKEND_HOST}:5000/api/payroll?companyId=${companyId}&from=${from}&to=${to}&uId=${userId}`,{
                 })
                 if (getHours.status !== 200) return setEmployees(undefined)
                 const hour = await getHours.json() as Payroll
                 setEmployees(hour)
             }
        })()
     },[from, to, userId])

    const myEmployees = employees ? Object.entries(employees.shift).map(([day, shift])=>{
        const shifts = shift.map(hour=>{
            return (
                <div key={hour.id} className={style.payroll_card}>
                    <div>
                        <label htmlFor="start">Commence</label>
                        <input type="time" name="start" id="start" defaultValue={hour.start} />
                    </div>
                    <div>
                        <label htmlFor="end">Termine</label>
                        <input type="time" name="end" id="end" defaultValue={hour.end} />
                    </div>
                    <div className={style.payroll_card_action}>
                        <form action={async (form)=>{
                            const {error} = await onDeleteHour(form)
                            if (!error) {
                                const id = employees.shift[day].findIndex(shift=>shift.id === hour.id)
                                employees.shift[day].splice(id, 1)
                                setEmployees(({...employees}))

                            }
                        }} className={style.payroll_card_action_form}>
                            <button type="submit" value={hour.id} name="id" className={style.payroll_card_action_btn}><Image src={trash} alt="trash" className={style.payroll_card_action_btn_icon} /> </button>
                        </form>
                        <form action={""} className={style.payroll_card_action_form}>
                            <button type="submit" className={style.payroll_card_action_btn}>Modifier</button>
                        </form>
                    </div>
                </div>
            )
        })
        return (
            <div key={day} className={style.payroll_day}>
                <h2>{day} </h2>
                <div className={style.payroll_shift}>
                    {shifts}
                </div>
            </div>
        )
    }) : null
    return (
        <div>
            <div className={style.payroll_top}>
                {children}
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Calendar className={style.payroll_top_calendar} type="between" hasMin={false} onChange={(newDate)=>{
                        if (newDate.length === 2){
                            setDate(newDate)                    
                        }
                    }} />
                </div>
            </div>
            {employees ? <div className={style.payroll_container} >
                <div className={style.payroll_card}>
                    <h3>{employees.name} </h3>
                    <p><b>Heures travaillé: </b>{employees.total} </p>
                    <p><b>Salaire:</b> {employees.salary} £</p>
                </div>
            </div> : null}
            <div className={style.payroll_top_hours}>
                {myEmployees}
            </div>
        </div>
    )
}

export default Payroll