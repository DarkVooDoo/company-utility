"use client"

import style from "./style.module.css"

import { useEffect, useState } from "react"
import Calendar from "@/component/Calendar"
import { BACKEND_HOST, GetCookie } from "@/util/lib"
import { Payroll } from "@/util/type"

const Payroll = ()=>{
    const [date, setDate] = useState<string[]>([])
    const [employees, setEmployees] = useState<Payroll[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
       (async ()=>{
            setLoading(true)
            const companyId = GetCookie("company-id")
            const getHours = await fetch(`${BACKEND_HOST}:5000/api/payroll?companyId=${companyId}&from=${date[0]}&to=${date[1]}`,{
            })
            if (getHours.status !== 200) return []
            const hour = await getHours.json() as Payroll[]
            setEmployees(hour)
            setLoading(false)
       })()
    },[date])
    const myEmployees = employees.map(employees=>(
        <div key={employees.name} className={style.payroll_card}>
            <h3>{employees.name} </h3>
            <p><b>Heures travaillé: </b>{employees.total} </p>
            <p><b>Salaire:</b> {employees.salary}</p>
        </div>
    ))
    return (
        <main className={style.payroll}>
            <div>
                <div className={style.payroll_top}>
                    <h2>Salaires</h2>
                    <Calendar className={style.payroll_top_calendar} type="between" hasMin={false} onChange={(newDate)=>{
                        if (newDate.length === 2){
                            setDate(newDate)                    
                        }
                    }} />
                </div>
                
            </div>
            {date.length > 0 && !loading ? myEmployees : <p>Selectionez une date</p>}
        </main>
    )
}

export default Payroll