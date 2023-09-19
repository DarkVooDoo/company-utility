"use client"
import style from "@/style/Calendar.module.css"
import {useEffect, useState } from "react"

import Image from "next/image"
import left from "../public/left-arrow.webp"
import right from "../public/right.webp"
import { GetCookie, GetMonthArray, GetYearDays } from "@/util/lib"

const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]
const seletedDays = new Set<number>()

interface CalendarProps {
    currentUser?: string,
    className?: string,
    hasMin?: boolean
    type?: "between" | "single",
    currentCompany?: string,
    onChange: (dates: string[])=> void
}  

const Calendar:React.FC<CalendarProps> = ({onChange, className, type = "single", hasMin = true, currentUser, currentCompany})=>{
    const [tDay, month, year] = new Date().toLocaleDateString().split("/")
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
        let isDayDisable: boolean
        const calendarDay = `${date.year}-${day.month < 9 ? '0'+(day.month+1) : (day.month+1)}-${day.dayNumber < 10 ? '0'+day.dayNumber : day.dayNumber}`
        const sortedDate = between.sort()
        const isBetween = sortedDate.length === 2 ? calendarDay < sortedDate[0] || calendarDay > sortedDate[1] : true
        const firstChoice = between[0] === calendarDay
        if (type === "single"){
            isDayDisable = day.isCurrentMonth && shift && shift.shift.findIndex(myShift=>myShift.shift_day === day.dayNumber && myShift.user_id === currentUser) === -1 ? false : true
        }else{
            if (hasMin) isDayDisable = calendarDay < `${year}-${month}-${tDay}` || !day.isCurrentMonth ? true : false
            else isDayDisable = !day.isCurrentMonth
        }
        let betweenFirstDay: number[] = []
        let betweenLastDay: number[] = []
        if(sortedDate.length === 2){
            betweenFirstDay = sortedDate[0].split("-").map((date, index)=>{
                if(index===1) return parseInt(date)-1
                return parseInt(date)
            })
            betweenLastDay = sortedDate[1].split("-").map((date, index)=>{
                if(index===1) return parseInt(date)-1
                return parseInt(date)
            })

        }
        const isFirst = betweenFirstDay[1] === day.month && betweenFirstDay[2] === day.dayNumber 
        const isLast = betweenLastDay[1] === day.month && betweenLastDay[2] === day.dayNumber

        return (
            <button disabled={isDayDisable} type="button" key={index} 
            className={`${style.calendar_day} 
            ${firstChoice && style.between_active} 
            ${type === 'between' ? !isBetween && day.isCurrentMonth ? style.between_active : "" : `${seletedDays.has(day.dayNumber) && day.isCurrentMonth ? style.active : ""}` }`}
            style={isFirst ? {borderTopLeftRadius: "25px", borderBottomLeftRadius: "25px"} : isLast ? {borderTopRightRadius: "25px", borderBottomRightRadius: "25px"} : {}}
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
                    between.push(calendarDay)
                    if (between.length > 2) setBetWeen([calendarDay])
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
                    }}><Image src={left} style={{transform: "rotate(180deg)"}} alt="Test" className={style.calendar_monthYear_btn_arrow} /></button>
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