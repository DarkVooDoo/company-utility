"use client"
import style from "@/style/Calendar.module.css"
import {useEffect, useState } from "react"

import Image from "next/image"
import left from "../public/left.webp"
import right from "../public/right.webp"
import { GetCookie, GetMonthArray, GetYearDays } from "@/util/lib"

const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]
const seletedDays = new Set<number>()

interface CalendarProps {
    currentUser: string,
    className?: string,
    type?: "between" | "single",
    currentCompany?: string,
    onChange: (dates: string[])=> void
}  

const Calendar:React.FC<CalendarProps> = ({onChange, className, type = "single", currentUser, currentCompany})=>{
    const [date, setDate] = useState({year: new Date().getFullYear(), month: new Date().getMonth(), daySelected: new Set<number>()})
    const [shift, setShift] = useState<{shift: {shift_day: number, shift_month: number, user_id: string}[]}>({shift: []})
    const [calendar, setCalendar] = useState<{isCurrentMonth: boolean, dayNumber: number, month: number}[]>([])
    const [between, setBetWeen] = useState<string[]>([])

    useEffect(()=>{
        const buildCalendar = GetMonthArray(date.year, date.month)
        setCalendar(buildCalendar.calendar)
        if (currentCompany){
            (async ()=>{
                const token = GetCookie("auth-token")
                if(token){
                    const buildCalendar = GetMonthArray(date.year, date.month)
                    const fetchShifts = await fetch(`http://localhost:5000/api/shift?companyId=${currentCompany}&from=${buildCalendar.from}&to=${buildCalendar.to}`,{
                        headers: [["Authorization", token]]
                    })
                    const shifts = await fetchShifts.json() as {shift: {shift_day: number, shift_month: number, user_id: string}[]}
                    setCalendar(buildCalendar.calendar)
                    setShift({shift: shifts.shift})
                }
            })()
        }
    },[date.month])

    useEffect(()=>{
        seletedDays.clear()
    }, [currentUser])

    const days = calendar.map((day,index)=>{
        const sortedDate = between.sort()
        const today = `${date.year}-${day.month < 9 ? '0'+(day.month+1) : (day.month+1)}-${day.dayNumber < 10 ? '0'+day.dayNumber : day.dayNumber}`
        const isBetween = sortedDate.length === 2 ? today < sortedDate[0] || today > sortedDate[1] : true
        const firstChoice = between[0] === today
        const isDayDisable = day.isCurrentMonth && shift && shift.shift.findIndex(myShift=>myShift.shift_day === day.dayNumber && myShift.user_id === currentUser) === -1 ? false : true
        return (
            <button disabled={isDayDisable} type="button" key={index} 
            className={`${style.calendar_day} ${firstChoice && style.between_active} ${type === 'between' ? !isBetween ? style.between_active : "" : `${seletedDays.has(day.dayNumber) && day.isCurrentMonth ? style.active : ""}` }`}
            onClick={(e)=>{
                if(type === "single"){
                    seletedDays.has(day.dayNumber) ? seletedDays.delete(day.dayNumber) : seletedDays.add(day.dayNumber)
                    e.currentTarget.classList.toggle(style.active)
                    setDate(date=>({...date, daySelected: new Set(seletedDays)}))
                    const dates:string[] = []
                    seletedDays.forEach(value=>{
                        dates.push(`${date.year}-${date.month < 10 ? `0${date.month+1}` : date.month+1}-${value < 10 ? `0${value}` : value}`)
                    })
                    onChange(dates)
                }else{
                    between.push(today)
                    if (between.length > 2) setBetWeen([today])
                    else setBetWeen([...between])
                    onChange(between.sort())
                }
            }} >{day.dayNumber} </button>
        )
    })
    const dayNames = DAYS.map(name=>(
        <div key={name} className={style.calendar_dayName_name}>{name} </div>
    ))
    return (
            <div className={`${style.calendar} ${className}`}>
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
            </div>
    )
}

export default Calendar