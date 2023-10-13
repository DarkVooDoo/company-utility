import { component$, useSignal, useTask$, $, useStore } from "@builder.io/qwik"
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city"

import style from "./style.module.css"
import { BACKEND_HOST, GetMonthArray, MONTH } from "~/lib/util"
import { DayShift, Payroll } from "~/lib/types"
import CustomSelect from "~/components/CustomSelect/component"

export const useGetMyGains = routeLoader$((req)=>{
    const companyId = req.cookie.get("company-id")?.value
    const userId = req.cookie.get("id")?.value
    return {company: companyId, user: userId}
})

interface MONTH {
    month: number
}

const MyPayroll = component$(()=>{
    // const date = useSignal<string[]>([])
    const vars = useGetMyGains()
    const gain = useSignal<Payroll>()
    const monthSignal = useStore<MONTH>({month: new Date().getMonth()+1})
    const selectedDayShift = useSignal<DayShift[]>()
    const currentDay = useSignal<string>()
    useTask$(async ({track})=>{
        track(()=>monthSignal.month)
        // userId et date
        const fetchGain = await fetch(`${BACKEND_HOST}:5000/api/payroll?companyId=${vars.value.company}&date=2023-${monthSignal.month}&uId=${vars.value.user}`)  
        const myGain = await fetchGain.json() as Payroll 
        gain.value = myGain
    })

    // const onDateChange = $((chosenDate: string[])=>{
    //     date.value = chosenDate
    // })

    const renderMonth = $((month: number)=>(
        <div class={style.payroll_resume_month} onClick$={()=>{
            monthSignal.month = month + 1
        }}>
            <p>{MONTH[month]} </p>
        </div>
    ))
    const shift = gain.value?.shift ? Object.entries(gain.value?.shift).map(([day, shift])=>{
        const shifts = shift.map(hour=>{
            return (
                <div key={hour.id} class={style.payroll_card}>
                    <div>
                        <label for="start">Commence</label>
                        <input type="time" name="start" id="start" value={hour.start} readOnly />
                    </div>
                    <div>
                        <label for="end">Termine</label>
                        <input type="time" name="end" id="end" value={hour.end} readOnly />
                    </div>
                </div>
            )
        })
        return (
            <details key={day} class={style.payroll_day}>
                <summary>{day} </summary>
                <div>
                    <div class={style.payroll_shift}>
                        {shifts}
                    </div>
                </div>
            </details>
        )
    }) : []
    const months = new Array(12).fill(0).map((_,month)=>month)
    const calendar = GetMonthArray(2023, monthSignal.month - 1).calendar.map(day=>{

        const hasShift = Object.keys(gain.value?.shift || []).findIndex(shift=>{
            const date = shift.split("-")
            return parseInt(date[0]) === day.dayNumber && parseInt(date[1]) - 1 === day.month 
        })
        const onDayClick = $(()=>{
            currentDay.value = `${day.dayNumber}-${day.month}`
            const key = Object.keys(gain.value?.shift || []).find(shift=>{
                const date = shift.split("-")
                return parseInt(date[0]) === day.dayNumber && parseInt(date[1]) - 1 === day.month 
            })
            if (!key)return selectedDayShift.value = undefined
            selectedDayShift.value = gain.value?.shift[key]
        })
        return (
            <button key={Math.random()} class={[
                style.payroll_calendar_day, 
                hasShift !== -1 && style.payroll_calendar_dayShift,
                currentDay.value === `${day.dayNumber}-${day.month}` && style.payroll_calendar_daySelected]} disabled={!day.isCurrentMonth ? true : false} onClick$={onDayClick}>
                {day.dayNumber}
            </button>
        )
    })
    const displayShift = selectedDayShift.value?.map((shift, index)=>(
        <div key={shift.id}>
            <div class={style.payroll_calendar_day_shift_times}>
                <div>
                    <b>{index === 0 ? "Start" : "Repris"} </b>
                    <p>{shift.start} </p>
                </div>
                <div>
                    <b>Finis</b>
                    <p>{shift.end} </p>

                </div>
            </div>
        </div>
    ))
    return (
        <div class={style.payroll}>
            <p style={{display: "none"}} onClick$={()=>{monthSignal.month = 1}}>{monthSignal.month} </p>
            {/* <Calendar {...{type: "between", onChange: onDateChange, hasMin: false}} /> */}
            <div class={style.payroll_resume}>
                <CustomSelect clasStyle={style.payroll_resume_select} value={MONTH[monthSignal.month - 1]} height={2} position="bottom" items={months} renderOption={renderMonth} />
                <div class={style.payroll_resume_gain}>
                    <div>
                        <p>Temps de travail</p>
                        <p class={style.payroll_resume_gain_value}>{gain.value?.total} </p>
                    </div>
                    <div>
                        <p>Revenue</p>
                        <p class={style.payroll_resume_gain_value}>{gain.value?.salary}£</p>
                    </div>
                </div>
            </div>
            <div class={style.payroll_calendar}>
                {calendar}
            </div>
            <div class={[style.payroll_calendar_day_shift]}>
                {displayShift}
            </div>
            {/* <div class={style.payroll_shift}>
                {shift}
            </div> */}
        </div>
    )
})

// const CalendarDay = component$(()=>{
//     const hasShift = Object.keys(gain.value?.shift || []).findIndex(shift=>{
//         const date = shift.split("-")
//         return parseInt(date[0]) === day.dayNumber && parseInt(date[1]) === day.month
//     })
//     return (
//         <button key={Math.random()} class={[style.payroll_calendar_day, hasShift !== -1 && style.payroll_calendar_dayShift]} disabled={!day.isCurrentMonth ? true : false}>
//             {day.dayNumber}
//             <div class={style.payroll_calendar_day_shift}>
//                 <p>Shift</p>
//             </div>
//         </button>
//     )
// })

export const head:DocumentHead = {
    title: "Mes Revenues"
}

export default MyPayroll