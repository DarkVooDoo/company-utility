"use client"
import { useEffect, useState } from "react"
import SelectOption from "@/component/SelectOption"
import Calendar from "@/component/Calendar"

import Image from "next/image"
import trash from "@/public/trash.svg"

import style from "./new.module.css"
import { GetCookie } from "@/util/lib"

interface ShiftTypes {
    user_id: string, 
    user_name: string,  
    shift_date: string[], 
    shift_start: string, 
    shift_end: string,
    shift_pause: number,
    company_id: string | undefined
}

const NewShift = ()=>{

    const [loading, setLoading] = useState(true)
    const [showCalendar, setShowCalendar] = useState(false)
    const [employee, setEmployee] = useState<ShiftTypes[]>([])
    const [currUser, setCurrUser] = useState<ShiftTypes>({user_name: "", user_id: "", company_id: undefined, shift_date: [], shift_start: "09:00", shift_end: "17:00", shift_pause: 0})
    const [userShift, setUserShift] = useState<ShiftTypes[]>([])

    useEffect(()=>{
        (async ()=>{
            const fetchEmployees = await fetch(`http://localhost:5000/api/shift?cId=${GetCookie("company-id")}`)
            const employees = await fetchEmployees.json()
            setEmployee(employees)
            setCurrUser(user=>({...user, ...employees[0], company_id: GetCookie("company-id")}))
            setLoading(false)
            // setCurrUser(user=>({...user, ...USERS[0]}))

        })()
    },[])

    const onSaveShift = async ()=>{
        const saveShift = await fetch(`http://localhost:5000/api/shift`, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({payload: userShift})
        })
    }

    const onAddUser = async ()=>{
        if(currUser.shift_date.length < 1) return
        const userExist = userShift.findIndex(user=>user.user_id === currUser.user_id && user.shift_start === currUser.shift_start && user.shift_end === currUser.shift_end)
        if(userExist > -1){
            userShift[userExist] = currUser
            setUserShift([...userShift])
        }else{
            setUserShift(users=>[...users, {...currUser}])
        }
    }

    const shifts = userShift.map((user, index)=>(
        <div key={index} className={style.shift_worker}>
            <div className={style.shift_worker_photo}>
                <div className={style.shift_worker_photo_content}>
                    <Image src={"https://robohash.org/avatar"} alt="Profile" width={300} height={300} className={style.shift_worker_photo_content_tag} />
                </div>
            </div>
            <h4 className={style.shift_worker_name}>{user.user_name} </h4>
            <button className={style.shift_worker_deleteBtn} onClick={()=>{
                const newUsers = userShift.filter((_, i)=> i !== index)
                setUserShift([...newUsers])
            }}><Image src={trash} alt="supprimer" className={style.shift_worker_deleteBtn_icon} /></button>
            <div className={style.shift_worker_date}>
                <p className={style.shift_worker_label}>Date</p>
                <div className={style.shift_worker_date_display}>
                    <p className={style.shift_worker_date_display_first}>{user.shift_date[0]}</p> 
                    <div className={style.shift_worker_date_display_all}>
                        {user.shift_date.sort((a, b)=>{
                            return parseInt(a.split("-")[2]) - parseInt(b.split("-")[2])
                        }).map(date=>(<p key={Math.random()}>{date} </p>))}
                    </div>
                </div>
            </div>
            <div className={style.shift_worker_start}>
                <p className={style.shift_worker_label}>De</p>
                <p>{user.shift_start} </p>
            </div>
            <div className={style.shift_worker_end}>
                <p className={style.shift_worker_label}>A</p>
                <p>{user.shift_end} </p>
            </div>
            <div className={style.shift_worker_pause}>
                <p className={style.shift_worker_label}>Pause</p>
                <p>{user.shift_pause} Mins </p>
            </div>
        </div>
    ))
    if(loading){
        return <p>Loading</p>
    }
    return (
        <main>
            <h1>Creer des plannings</h1>
            <div className={style.shift_name}>
                <SelectOption
                    className={style.shift_name_option}
                    items={employee}
                    value={`${currUser.user_name}`}
                    render={(user)=><div key={user.user_id} className={style.dropdown} onClick={()=>{setCurrUser(cUser=>({...cUser, ...user}))}}>{user.user_name} </div>} 
                />
                <button type="button" className={style.shift_addBtn} onClick={onAddUser}>Ajouter</button>
            </div>
            <div className={style.shift_time}>
                <div className={style.shift_time_t}>
                    <p>Date</p>
                    <button className={style.shift_time_t_dateBtn} onClick={()=>setShowCalendar(state=>!state)}>ICON</button>
                    {showCalendar && <Calendar {...{currentUser: currUser.user_id, className: style.shift_time_t_calendar, currentCompany: currUser.company_id, onChange: (dates)=>{
                        setCurrUser(user=>({...user, shift_date: dates, company_id: GetCookie("company-id")}))
                    }}} />}
                </div>  
                <div className={style.shift_time_t}>
                    <label htmlFor="start">Commence</label>
                    <input type="time" name="start" id="start" className={style.shift_time_t_input} value={currUser.shift_start} onChange={({currentTarget:{value}})=>{
                        setCurrUser(user=>({...user, shift_start: value, company_id: GetCookie("company-id")}))
                    }} />
                </div>
                <div className={style.shift_time_t}>
                    <label htmlFor="end">Fini</label>
                    <input type="time" name="end" id="end" className={style.shift_time_t_input} value={currUser.shift_end} onChange={({currentTarget:{value}})=>{
                        setCurrUser(user=>({...user, shift_end: value, company_id: GetCookie("company-id")}))
                    }} />
                </div>
                <div className={style.shift_time_t}>
                    <label htmlFor="pause">Pause</label>
                    <input type="number" name="pause" id="pause" className={style.shift_time_t_input} value={currUser.shift_pause.toString()} onChange={({currentTarget:{value}})=>{
                        setCurrUser(user=>({...user, shift_pause: parseInt(value), company_id: GetCookie("company-id")}))
                    }} />
                </div>
            </div>
            <div>
                {shifts}
                {shifts.length > 0 && <button type="button" className={style.shift_saveBtn} onClick={onSaveShift}>Enregistrer</button>}
            </div>
        </main>
    )
}

export default NewShift