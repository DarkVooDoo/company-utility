import { QRL, Resource, Signal, component$, useResource$, useSignal, useStore, useTask$ } from "@builder.io/qwik"

import Left from "~/media/left-arrow.webp?jsx"

import style from "./style.module.css"
import {GetMonthArray, GetYearDays } from "~/lib/util"

const DAYS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"]
const seletedDays = new Set<number>()

interface Props{
    currentUser?: string,
    className?: string,
    hasMin?: boolean
    type?: "between" | "single",
    betweenValue?: string[]
    currentCompany?: string,
    onChange: QRL<(date: string[])=>void>
}

const Calendar = component$<Props>(({onChange, className, type = "single", hasMin = true, currentUser, currentCompany, betweenValue = []})=>{
    const [tDay, month, year] = new Date().toLocaleDateString().split("/")
    const date = useSignal<{year: number, month: number, daySelected: number[]}>({year: new Date().getFullYear(), month: new Date().getMonth(), daySelected: []})
    const shift = useSignal<{shift: {shift_day: number, shift_month: number, user_id: string}[]}>({shift: []})
    const calendar = useSignal<{isCurrentMonth: boolean, dayNumber: number, month: number}[]>([])
    const between = useSignal<string[]>(betweenValue)

    const buildCalendar = useResource$(async ({track})=>{
        track(()=>date.value.month)
        const buildCalendar = GetMonthArray(date.value.year, date.value.month)
        calendar.value = buildCalendar.calendar
        if (currentCompany){
            console.log("fetching")
            // const token = GetCookie("auth-token")
            // if(token){
            //     const buildCalendar = GetMonthArray(date.value.year, date.value.month)
            //     const fetchShifts = await fetch(`http://localhost:5000/api/shift?companyId=${currentCompany}&from=${buildCalendar.from}&to=${buildCalendar.to}`,{
            //         headers: [["Authorization", token]]
            //     })
            //     const shifts = await fetchShifts.json() as {shift: {shift_day: number, shift_month: number, user_id: string}[]}
            //     setCalendar(buildCalendar.calendar)
            //     setShift({shift: shifts.shift})
            // }
        }
        return {calendar: calendar.value}
    })

    const dayNames = DAYS.map(name=>(
        <div key={name} class={style.calendar_dayName_name}>{name} </div>
    ))
    return (
        <div class={[style.calendar, className]}>
            <div class={style.calendar_monthYear}>
                <button type="button" class={style.calendar_monthYear_btn} onClick$={(e)=>{
                    if(date.value.month === 0){
                        const {year, monthIndex} = GetYearDays(date.value.year-1, 11)
                        date.value = {year, month: monthIndex, daySelected: []}
                    }else{
                        const {year, monthIndex} = GetYearDays(date.value.year, date.value.month-1)
                        date.value = {year, month: monthIndex, daySelected: []}
                    }
                    // seletedDays.clear()
                }}><Left alt="Test" class={style.calendar_monthYear_btn_arrow} /> </button>
                <button type="button" class={style.calendar_monthYear_btn}>{GetYearDays(date.value.year, date.value.month).month}, {date.value.year}</button>
                <button type="button" class={style.calendar_monthYear_btn} onClick$={()=>{
                    if(date.value.month === 11){
                        const {year, monthIndex} = GetYearDays(date.value.year+1, 0)
                        date.value = {year, month: monthIndex, daySelected: []}
                    }else{
                        const {year, monthIndex} = GetYearDays(date.value.year, date.value.month+1)
                        date.value = {year, month: monthIndex, daySelected: []}
                    }
                    seletedDays.clear()
                }}><Left style={{transform: "rotate(180deg)"}} alt="Test" class={style.calendar_monthYear_btn_arrow} /></button>
            </div>
            <div class={style.calendar_dayName}>
                {dayNames}
            </div>
            <Resource
            value={buildCalendar}
            onPending={()=><p>Loading</p>}
            onResolved={({calendar})=>{
                const days = calendar.map((day,index)=>{ 
                let isDayDisable: boolean
                const calendarDay = `${date.value.year}-${day.month < 9 ? '0'+(day.month+1) : (day.month+1)}-${day.dayNumber < 10 ? '0'+day.dayNumber : day.dayNumber}`
                const sortedDate = between.value.sort()
                const isBetween = sortedDate.length === 2 ? calendarDay < sortedDate[0] || calendarDay > sortedDate[1] : true
                const firstChoice = between.value[0] === calendarDay
                if (type === "single"){
                    isDayDisable = day.isCurrentMonth && shift && shift.value.shift.findIndex(myShift=>myShift.shift_day === day.dayNumber && myShift.user_id === currentUser) === -1 ? false : true
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
                    class={`${style.calendar_day} 
                    ${firstChoice && style.between_active} 
                    ${type === 'between' ? !isBetween && day.isCurrentMonth ? style.between_active : "" : `${seletedDays.has(day.dayNumber) && day.isCurrentMonth ? style.active : ""}` }`}
                    style={isFirst ? {borderTopLeftRadius: "25px", borderBottomLeftRadius: "25px"} : isLast ? {borderTopRightRadius: "25px", borderBottomRightRadius: "25px"} : {}}
                    onClick$={()=>{
                        if(type === "single"){
                            seletedDays.has(day.dayNumber) ? seletedDays.delete(day.dayNumber) : seletedDays.add(day.dayNumber)
                            // e.target.classList.toggle(style.active)
                            date.value = {...date.value, daySelected: [...seletedDays]}
                            const dates:string[] = []
                            seletedDays.forEach(value=>{
                                dates.push(`${date.value.year}-${date.value.month+1 < 10 ? `0${date.value.month+1}-` : date.value.month+1}-${value < 10 ? `0${value}` : value}`)
                            })
                            onChange(dates)
                        }else{
                            between.value.push(calendarDay)
                            between.value = between.value
                            if (between.value.length > 2) between.value = [calendarDay]
                            else between.value = [...between.value]
                            onChange(between.value.sort())
                        }
                    }} >{day.dayNumber} </button>
                )
                })
                return (
                    <div class={style.calendar_days}>
                        {days}
                    </div>
                )
            }}
            />
        </div>
    )
})

export default Calendar