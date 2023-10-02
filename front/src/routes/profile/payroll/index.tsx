import { component$, useSignal, useTask$, $ } from "@builder.io/qwik"
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city"

import style from "./style.module.css"
import { BACKEND_HOST, MONTH } from "~/lib/util"
import { Payroll } from "~/lib/types"
import CustomSelect from "~/components/CustomSelect/component"

export const useGetMyGains = routeLoader$((req)=>{
    const companyId = req.cookie.get("company-id")?.value
    const userId = req.cookie.get("id")?.value
    return {company: companyId, user: userId}
})

const MyPayroll = component$(()=>{
    // const date = useSignal<string[]>([])
    const vars = useGetMyGains()
    const gain = useSignal<Payroll>()
    const monthSignal = useSignal(new Date().getMonth()+1)
    useTask$(async ({track})=>{
        track(()=>monthSignal.value)
        // userId et date
        const fetchGain = await fetch(`${BACKEND_HOST}:5000/api/payroll?companyId=${vars.value.company}&date=2023-${monthSignal.value}&uId=${vars.value.user}`)  
        const myGain = await fetchGain.json() as Payroll 
        gain.value = myGain
    })

    // const onDateChange = $((chosenDate: string[])=>{
    //     date.value = chosenDate
    // })
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
                <div class={style.payroll_shift}>
                    {shifts}
                </div>
            </details>
        )
    }) : []
    // const months = new Array(12).fill(0).map((_,month)=>month)
    const months = new Array(12).fill(0).map((_,month)=>month).map(month=><option key={month} value={month+1} class={style.select_option} selected={monthSignal.value === month+1}>{MONTH[month]}</option>)
    return (
        <div class={style.payroll}>
            {/* <Calendar {...{type: "between", onChange: onDateChange, hasMin: false}} /> */}
            <div class={style.payroll_resume}>
                <select name="month" id="month" class={style.select} onChange$={(e)=>monthSignal.value = parseInt(e.target.value)}>
                    {months}
                </select>
                {/* <CustomSelect value={MONTH[monthSignal.value]} height={2} position="bottom" items={months} renderOption={renderMonth} /> */}
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
            <div class={style.payroll_shift}>
                {shift}
            </div>
        </div>
    )
})

export const head:DocumentHead = {
    title: "Mes Revenues"
}

export default MyPayroll