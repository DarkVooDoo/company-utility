import { component$, useSignal, useTask$, $, useStore } from "@builder.io/qwik"
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

interface KEKW {
    month: number
}

const MyPayroll = component$(()=>{
    // const date = useSignal<string[]>([])
    const vars = useGetMyGains()
    const gain = useSignal<Payroll>()
    const monthSignal = useStore<KEKW>({month: new Date().getMonth()+1})
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
                <div class={style.payroll_shift}>
                    {shifts}
                </div>
            </details>
        )
    }) : []
    const months = new Array(12).fill(0).map((_,month)=>month)
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