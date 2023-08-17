"use client"

import style from "./style.module.css"
import { GetCookie, GetMonthArray, MONTH, hasChanged } from "@/util/lib"
import { useContext, useEffect, useState } from "react"

import Link from "next/link"
import Image from "next/image"
import Edit from "@/public/edit.svg"
import trash from "@/public/trash.svg"

import SelectOption from "@/component/SelectOption"
import MyCompanys from "@/component/MyCompanys/component"
import PopupAlert from "../PopupAlert/Component"
import { userContext } from "../UserContext"

export interface ShiftTypes {
    user_id: string,
    user_name: string,
    role: string,
    shift_id: string,
    shift_day: number,
    shift_month: number,
    shift_start: string,
    shift_pause: number,
    shift_end: string
}

interface Props{
    companys: {id: string, name: string, adresse: string, postal: number}[],
}

let initialShifts:Pick<ShiftTypes, "shift_start" | "shift_end" | "shift_pause">[] = [{shift_end: "", shift_pause: 32, shift_start: ""}]
const Shift:React.FC<Props> = ({companys})=>{
    const [user] = useContext(userContext)
    const [loading, setLoading] = useState(true)
    const [selectedCompany, setSelectedCompany] = useState<string>()
    const [date, setDate] = useState({year: 2023, month: MONTH[new Date().getMonth()]})
    const [userShift, setUserShift] = useState<{role: String, shift: ShiftTypes[]}>({role: "User", shift: []})
    const [shift, setShift] = useState<{isCurrentMonth: boolean, dayNumber: number, month: number}[]>([])
    const [showShift, setShowShift] = useState<ShiftTypes[]>()
    const [selectedCell, setSelectedCell] = useState<number | undefined>(undefined)
    const [popupMessage, setPopupMessage] = useState<undefined | {message: string, isSuccess: boolean}>(undefined)

    const onEditShift = async()=>{
        const [_, changes] = hasChanged(initialShifts, userShift.shift, ["shift_end", "shift_pause", "shift_start"])
        const editShift = await fetch(`http://localhost:5000/api/shift`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({shifts: changes})
        })
        if(editShift.status === 200 ){
            setPopupMessage({isSuccess: true, message: "Planning modifié"})
        }
    }

    const onDeleteShift = async(id: string)=>{
        const deleteShift = await fetch(`http://localhost:5000/api/shift`,{
            method: "DELETE",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({id})
        })
        if (deleteShift.status === 200){
            const newShift = userShift.shift.filter(shift=>shift.shift_id != id)
            setShowShift(showShift?.filter(shift=>shift.shift_id != id))
            setUserShift(prev=>({...prev, shift: newShift}))
            initialShifts = newShift
        }
    }

    useEffect(()=>{
        (async ()=>{
            const token = GetCookie("auth-token")
            const companyId = GetCookie("company-id")
            if (companyId && token){
                const currentMonth = GetMonthArray(new Date().getFullYear(), MONTH.findIndex(month=>month===date.month))
                const fetchShift = await fetch(`http://localhost:5000/api/shift?companyId=${companyId}&from=${currentMonth.from}&to=${currentMonth.to}`,{
                    headers: [["Authorization", token]]
                }) 
                if (fetchShift.status === 204){
                    setUserShift({role: "User", shift: []})
                    return 
                }
                const shift = await fetchShift.json() as {role: string, shift: ShiftTypes[]}
                setShift(currentMonth.calendar)
                if(shift){
                    setUserShift(shift)
                    initialShifts = [...shift.shift]
                }
                setLoading(false)
            }
        })()
    },[date, selectedCompany])

    const onShiftChange = (newShift: ShiftTypes)=>{
        const shiftIndex = userShift.shift.findIndex(myShift=>myShift.shift_id === newShift.shift_id)
        userShift.shift[shiftIndex] = newShift
        setUserShift(prev=>({...prev, shift: [...userShift.shift]}))
    }

    const days = shift.map((day, index)=>{
        const userExist = userShift.shift.findIndex(shift=>shift.shift_day === day.dayNumber && shift.user_id === user.user_id && shift.shift_month-1 === day.month)
        if (userExist != -1){
            return (
                <button disabled={day.isCurrentMonth ? false : true} 
                type="button" key={index} className={`${style.shift_calendar_day} ${userShift.shift[userExist].user_id === user.user_id ? style.shift_active : ""} ${selectedCell === index && style.selected}`}onClick={()=>{
                    const shifts = userShift.shift.filter(shift=>shift.shift_day === day.dayNumber && day.month === shift.shift_month-1)
                    setShowShift([...shifts])
                    setSelectedCell(index)
                }} >{day.dayNumber} </button>
            )
        }
        return (
            <button disabled={!day.isCurrentMonth} type="button" key={index} className={`${style.shift_calendar_day} ${selectedCell === index && style.selected}` } onClick={()=>{
                const shifts = userShift.shift.filter(shift=>shift.shift_day===day.dayNumber && day.month === shift.shift_month-1)
                    setShowShift(shifts)
                    setSelectedCell(index)
            }} >{day.dayNumber} </button>
        )
    })

    if(loading) return <p>Loading</p>
    const isAdmin = userShift.role === "Boss" || userShift.role === "Admin" ? true : false
    const displayDayShift = showShift && showShift.map(shift=><DisplayShift key={shift.shift_id} {...{shift, isAdmin, onDeleteShift, onShiftChange}} />)
    return (
        <>
            <MyCompanys {...{companys, type: "Shift", onCompanyChange: (id)=>setSelectedCompany(id)}} />
            <div className={style.header}>
                {isAdmin && <Link href="/shift/new" className={style.header_planningBtn} >Creer un planning</Link>}
                <SelectOption
                    value={date.month}
                    items={MONTH} 
                    render={(month)=><div key={month} className={style.header_month_list_month} onClick={()=>{
                        setDate(date=>({...date, month}))
                        setShowShift(undefined)
                    }}>{month} </div>}
                    />
            </div>
            <div className={style.shift_calendar}>
                {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map(name=>(<p key={name} className={style.shift_calendar_dayName}>{name} </p>))}
                {days}
            </div>
            {selectedCell && <h1 className={style.shift_date}>
                {shift[selectedCell].dayNumber} {MONTH[shift[selectedCell].month]}
                {hasChanged(initialShifts, userShift.shift, ["shift_start", "shift_end", "shift_pause"])[0] && <button type="button" className={style.shift_date_editBtn} onClick={onEditShift}><Image src={Edit} alt="edit" className={style.shift_date_editBtn_icon} /></button>}
            </h1>}
            {displayDayShift}
            {popupMessage && <PopupAlert {...{...popupMessage, onAnimationEnd: ()=>{}}} />}
        </>
    )
}

const DisplayShift:React.FC<{shift: ShiftTypes, isAdmin: boolean, onDeleteShift: (id: string)=>void, onShiftChange: (newShift: ShiftTypes)=>void}> = ({shift, isAdmin, onDeleteShift, onShiftChange})=>{

    const [start, setStart] = useState(shift.shift_start)
    const [end, setEnd] = useState(shift.shift_end)
    const [pause, setPause] = useState(shift.shift_pause)

    return (
        <div key={shift.shift_id} className={style.shift_display_shift}>
            <div className={style.shift_display_shift_name}>
                <h3>{shift.user_name} </h3>
                {isAdmin && <Image src={trash} alt="supprimer" className={style.shift_display_shift_name_supprimer} onClick={()=>onDeleteShift(shift.shift_id)} />}
            </div>
            <div> 
                <p className={style.shift_display_label}>Commence</p>
                <input type="time" name="start" value={start} className={style.shift_display_content} readOnly={isAdmin ? false : true}
                onChange={({currentTarget: {value}})=>{
                    setStart(value)
                    onShiftChange({...shift, shift_start: value, shift_end: end, shift_pause: pause})
                }} />
            </div>
            <div>
                <p className={style.shift_display_label}>Finis</p>
                <input type="time" value={end} className={style.shift_display_content} readOnly={isAdmin ? false : true}
                onChange={({currentTarget: {value}})=>{
                    setEnd(value)
                    onShiftChange({...shift, shift_start: start, shift_end: value, shift_pause: pause})
                }} />
            </div>
            <div>
                <p className={style.shift_display_label}>Pause</p>
                <input type="number" name="pause" id="pause" value={pause.toString()} className={style.shift_display_content} readOnly={isAdmin ? false : true}
                onChange={({currentTarget: {value}})=>{
                    setPause(parseInt(value))
                    onShiftChange({...shift, shift_start: start, shift_end: end, shift_pause: parseInt(value)})
                }} />
            </div>
        </div>
    )
}

export default Shift