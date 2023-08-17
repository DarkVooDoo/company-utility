"use client"
import style from "@/style/Calendar.module.css"
import {useEffect, useState } from "react"

import Image from "next/image"
import left from "../public/left.webp"
import right from "../public/right.webp"
import { GetMonthArray, GetYearDays } from "@/util/lib"

const monthGrid = new Array(42).fill(0)
const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]
const seletedDays = new Set<number>()

interface CalendarProps {
    currentUser: string,
    currentCompany: string | undefined,
    onChange: (dates: string[])=> void
} 

const Calendar:React.FC<CalendarProps> = ({onChange, currentUser, currentCompany})=>{
    const [showCalendar, setShowCalendar] = useState(false)
    const [dayAmount] = useState(GetYearDays(new Date().getFullYear(), new Date().getMonth()))
    const [date, setDate] = useState({year: new Date().getFullYear(), month: new Date().getMonth(), daySelected: new Set<number>()})
    const [shift, setShift] = useState<{shift_day: number}[]>([])
    const [calendar, setCalendar] = useState<{isCurrentMonth: boolean, dayNumber: number}[]>([])

    useEffect(()=>{
        (async ()=>{
            const buildCalendar = GetMonthArray(date.year, date.month)
            console.log(`${date.year}${date.month+1 < 10 ? "0"+(date.month+1) : date.month+1}-31`)
            const fetchShifts = await fetch(`http://localhost:5000/api/shift?uId=${currentUser}&companyId=${currentCompany}&from=${date.year}-${date.month+1 < 10 ? "0"+(date.month+1) : date.month+1}-01&to=${date.year}-${date.month+1 < 10 ? "0"+(date.month+1) : date.month+1}-31`)
            const shifts = await fetchShifts.json() as {shift_day: number}[]
            setCalendar(buildCalendar.calendar)
            shifts ? setShift(shifts) : setShift([])
        })()
    },[date.month, currentUser])

    const days = calendar.map((day,index)=>{
        const isDayDisable = day.isCurrentMonth && shift && shift.findIndex(myShift=>myShift.shift_day === day.dayNumber) === -1 ? false : true
        return (
            <button disabled={isDayDisable} type="button" key={index} className={`${style.calendar_day} ${seletedDays.has(day.dayNumber) && day.isCurrentMonth ? style.active : ""}`} onClick={(e)=>{
                seletedDays.has(day.dayNumber) ? seletedDays.delete(day.dayNumber) : seletedDays.add(day.dayNumber)
                e.currentTarget.classList.toggle(style.active)
                setDate(date=>({...date, daySelected: new Set(seletedDays)}))
            }} >{day.dayNumber} </button>
        )
    })
    const dayNames = DAYS.map(name=>(
        <div key={name} className={style.calendar_dayName_name}>{name} </div>
    ))
    return (
        <div className={style.container}>
            <button type="button" className={style.btn} onClick={()=>{
                setShowCalendar(state=>!state)
                if(showCalendar){
                    const dates:string[] = []
                    date.daySelected.forEach(value=>{
                        dates.push(`${date.year}-${date.month < 10 ? `0${date.month+1}` : date.month+1}-${value < 10 ? `0${value}` : value}`)
                    })
                    onChange(dates)
                }
            }}>Calendar</button>
            {showCalendar &&<div className={style.calendar}>
                <div className={style.calendar_monthYear}>
                    <button type="button" className={style.calendar_monthYear_btn} onClick={()=>{
                        setDate(date=>{
                            if(date.month === 0){
                                const {year, monthIndex} = GetYearDays(date.year-1, 11)
                                return {year, month: monthIndex, daySelected: new Set()}
                            }else{
                                const {year, monthIndex} = GetYearDays(date.year, date.month-1)
                                return {year, month: monthIndex, daySelected: new Set()}
                            }
                        })
                        seletedDays.clear()
                    }}><Image src={left} alt="Test" className={style.calendar_monthYear_btn_arrow} /> </button>
                    <button type="button" className={style.calendar_monthYear_btn}>{GetYearDays(date.year, date.month).month}, {date.year}</button>
                    <button type="button" className={style.calendar_monthYear_btn} onClick={()=>{
                        setDate(date=>{
                            if(date.month === 11){
                                const {year, monthIndex} = GetYearDays(date.year+1, 0)
                                return {year, month: monthIndex, daySelected: new Set()}
                            }else{
                                const {year, monthIndex} = GetYearDays(date.year, date.month+1)
                                return {year, month: monthIndex, daySelected: new Set()}
                            }
                        })
                        seletedDays.clear()
                    }}><Image src={right} alt="Test" className={style.calendar_monthYear_btn_arrow} /></button>
                </div>
                <div className={style.calendar_dayName}>
                    {dayNames}
                </div>
                <div className={style.calendar_days}>
                    {days}
                </div>
            </div>}
        </div>
    )
}

export default Calendar