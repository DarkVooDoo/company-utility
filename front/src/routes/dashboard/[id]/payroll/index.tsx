import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik"

import style from "./style.module.css"
import { type Member, type Payroll } from "~/lib/types"
import { DocumentHead, routeLoader$, useLocation } from "@builder.io/qwik-city"
import { BACKEND_HOST, GetCookie } from "~/lib/util"

import Trash from "~/media/trash.svg?jsx"

import Calendar from "~/components/Calendar/component"
import CustomSelect from "~/components/CustomSelect/component"

export const useGetEmployees = routeLoader$(async (req)=>{
    const token = req.cookie.get("auth-token")?.value
    const companyId = req.params.id
    if (!token) return []
    const fetchMember = await fetch(`${BACKEND_HOST}:5000/api/member?companyId=${companyId}`,{
        headers: [["Authorization", token]]
    })
    return await fetchMember.json() as Member[]
})

const Payroll = component$(()=>{
    const loc = useLocation()
    const members = useGetEmployees() 
    const selectedMember = useSignal<{id: string, name: string} | undefined>({id: members.value[0].user_id, name: members.value[0].name})
    const employees = useSignal<Payroll>()
    const date = useSignal<string[]>([])
    // const displayMember = members.value.map(member=><button key={member.id} class={style.payroll_top_names_btn} style={member.user_id === selectedMember.value?.id ? {backgroundColor: "lightgray"} : {}} onClick$={()=>selectedMember.value = {id: member.user_id, name: member.name}}>{member.name} </button>)
    
    const onDateChange = $((newDate: string[])=>{
        if (newDate.length === 2){
            date.value = newDate                   
        }
    })

    useVisibleTask$(async ({track})=>{
        const [from, to] = date.value
        track(()=>{
            return {date: date.value, member: selectedMember.value}
        })
        if(date.value.length === 2){
            const companyId = loc.params.id
            const token = GetCookie("auth-token")
            if(token){
                const getHours = await fetch(`${BACKEND_HOST}:5000/api/payroll?companyId=${companyId}&from=${from}&to=${to}&uId=${selectedMember.value?.id}`,{
                    headers: [["Authorization", token]]
                })
                if (getHours.status !== 200) return employees.value = undefined
                const hour = await getHours.json() as Payroll
                employees.value = hour
            }
        }
    })

    const renderOptions = $((item: Member)=>{
        return(
            <div onClick$={()=>selectedMember.value = {id: item.user_id, name: item.name}}>{item.name} </div>
        )
    })

    const myEmployees = employees.value ? Object.entries(employees.value.shift).map(([day, shift])=>{
        const shifts = shift.map(hour=>{
            return (
                <div key={hour.id} class={style.payroll_shift_card}>
                    <div>
                        <div>
                            <label for="start">Commence</label>
                            <input type="time" name="start" id="start" value={hour.start} />
                        </div>
                        <div>
                            <label for="end">Termine</label>
                            <input type="time" name="end" id="end" value={hour.end} />
                        </div>
                    </div>
                    <div class={style.payroll_card_action}>
                        <button type="button" value={hour.id} name="id" class={style.payroll_card_action_btn}><Trash  alt="trash" class={style.payroll_card_action_btn_icon} /> </button>
                        <button type="button" class={style.payroll_card_action_btn}>Modifier</button>
                    </div>
                </div>
            )
        })
        return (
            <details key={day} class={style.payroll_day}>
                <summary>{day} ({employees.value?.hour}) </summary>
                <div class={style.payroll_shift}>
                    {shifts} 
                </div>
            </details>
        )
    }) : null
    return (
        <div>
            <div class={style.payroll_top}>
                <div class={style.payroll_top_selection}>
                    <CustomSelect width={15} value={selectedMember.value?.name || "Choisir un employees"} items={members.value} position="bottom" renderOption={renderOptions}/>
                    <div class={style.payroll_card_selection_resume}>
                        <p><b>Heures travaillé: </b>{employees.value?.total || 0} </p>
                        <p class={style.payroll_card_selection_resume_salary}><b class={style.payroll_card_selection_resume_salary_label}>Salaire:</b> {employees.value?.salary || 0}£ </p>
                    </div>
                </div>
                <Calendar  type="between" hasMin={false} onChange={onDateChange} clasStyle={style.payroll_calendar} />
            </div>
            <div class={style.payroll_top_hours}>
                {myEmployees}
            </div>
        </div>
    )
})

export const head:DocumentHead = {
    title: "Paie"
}

export default Payroll