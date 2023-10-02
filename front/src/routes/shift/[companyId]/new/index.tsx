import { component$, useSignal, $ } from "@builder.io/qwik"

import style from "./style.module.css"
import Calendar from "~/components/Calendar/component"
import { DocumentHead, routeAction$, routeLoader$ } from "@builder.io/qwik-city"
import { Member, NewShift } from "~/lib/types"

import Trash from "~/media/trash.svg?jsx"

export const useSaveShift = routeAction$(async(form, req)=>{
    const {memberShift} = form
    const saveShift = await fetch(`http://localhost:5000/api/shift`, {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({planning: memberShift, companyId: req.params.companyId})
    })
    if (saveShift.status === 200){
        // router.push("/shift")
    }
})

export const useGetMember = routeLoader$(async (req)=>{
    const fetchEmployees = await fetch(`http://localhost:5000/api/shift?cId=${req.cookie.get("company-id")?.value}`)
    return await fetchEmployees.json() as Pick<Member, "id" | "name" | "role">[]
})

const NewShift = component$(()=>{
    const data = useGetMember()
    const saveShift = useSaveShift()
    const currentMember = useSignal<NewShift>({user_name: data.value[0].name, user_id: data.value[0].id, shift_date: [], shift_start: "09:00", shift_end: "17:00", shift_pause: 0})
    const memberShift = useSignal<NewShift[]>([])
    const showCalendar = useSignal(false)

    const onAddUser = $(async ()=>{
        if(currentMember.value.shift_date.length < 1) return
        const userExist = memberShift.value.findIndex(user=>user.user_id === currentMember.value.user_id && user.shift_start === currentMember.value.shift_start && user.shift_end === currentMember.value.shift_end)
        if(userExist > -1){
            memberShift.value[userExist] = currentMember.value
            memberShift.value = [...memberShift.value]
        }else{
            memberShift.value = [...memberShift.value, {...currentMember.value}]
        }
    })

    const onDateChange = $((dates: string[])=>{
        currentMember.value = {...currentMember.value, shift_date: dates}
    })

    const shifts = memberShift.value.map((user, index)=>(
        <div key={index} class={style.shift_worker}>
            <div class={style.shift_worker_photo}>
                <div class={style.shift_worker_photo_content}>
                    {/* <Image src={"https://robohash.org/avatar"} alt="Profile" width={300} height={300} class={style.shift_worker_photo_content_tag} /> */}
                </div>
            </div>
            <h4 class={style.shift_worker_name}>{user.user_name} </h4>
            <button class={style.shift_worker_deleteBtn} onClick$={()=>{
                const newUsers = memberShift.value.filter((_, i)=> i !== index)
                memberShift.value = [...newUsers]
            }}><Trash alt="supprimer" class={style.shift_worker_deleteBtn_icon} /></button>
            <div class={style.shift_worker_date}>
                <p class={style.shift_worker_label}>Date</p>
                <div class={style.shift_worker_date_display}>
                    <p class={style.shift_worker_date_display_first}>{user.shift_date[0]}</p> 
                    <div class={style.shift_worker_date_display_all}>
                        {user.shift_date.sort((a, b)=>{
                            return parseInt(a.split("-")[2]) - parseInt(b.split("-")[2])
                        }).map(date=>(<p key={Math.random()}>{date} </p>))}
                    </div>
                </div>
            </div>
            <div class={style.shift_worker_start}>
                <p class={style.shift_worker_label}>De</p>
                <p>{user.shift_start} </p>
            </div>
            <div class={style.shift_worker_end}>
                <p class={style.shift_worker_label}>A</p>
                <p>{user.shift_end} </p>
            </div>
            <div class={style.shift_worker_pause}>
                <p class={style.shift_worker_label}>Pause</p>
                <p>{user.shift_pause} Mins </p>
            </div>
        </div>
    ))
    return (
        <main>
            <h1>Creer des plannings</h1>
            <div class={style.shift_name}>
                {/* <SelectOption
                    class={style.shift_name_option}
                    items={employee}
                    value={`${currentMember.user_name}`}
                    render={(user)=><div key={user.user_id} class={style.dropdown} onClick={()=>{setcurrentMember(cUser=>({...cUser, ...user}))}}>{user.user_name} </div>} 
                /> */}
                <select name="member" id="member" onChange$={({target:{value}})=>{
                    const user = JSON.parse(value)
                    currentMember.value = {...currentMember.value, user_id: user.id, user_name: user.name}
                }}>
                    {data.value.map(member=><option key={member.id} selected={currentMember.value.user_id === member.id} value={JSON.stringify({id: member.id, name: member.name})}>{member.name}</option>)}
                </select>
                <button type="button" class={style.shift_addBtn} onClick$={onAddUser}>Ajouter</button>
            </div>
            <div class={style.shift_time}>
                <div class={style.shift_time_t}>
                    <p>Date</p>
                    <button class={style.shift_time_t_dateBtn} onClick$={()=>showCalendar.value = !showCalendar.value}>Calandrier</button>
                    {showCalendar.value && <Calendar {...{currentUser: currentMember.value.user_id, clasStyle: style.shift_time_t_calendar, onChange: onDateChange}} />}
                </div>  
                <div class={style.shift_time_t}>
                    <label for="start">Commence</label>
                    <input type="time" name="start" id="start" class={style.shift_time_t_input} value={currentMember.value.shift_start} onChange$={({target:{value}})=>{
                        currentMember.value = {...currentMember.value, shift_start: value}
                    }} />
                </div>
                <div class={style.shift_time_t}>
                    <label for="end">Fini</label>
                    <input type="time" name="end" id="end" class={style.shift_time_t_input} value={currentMember.value.shift_end} onChange$={({target:{value}})=>{
                        currentMember.value = {...currentMember.value, shift_end: value}
                    }} />
                </div>
                <div class={style.shift_time_t}>
                    <label for="pause">Pause</label>
                    <input type="number" name="pause" id="pause" class={style.shift_time_t_input} value={currentMember.value.shift_pause.toString()} onChange$={({target:{value}})=>{
                        currentMember.value = {...currentMember.value, shift_pause: parseInt(value)}
                    }} />
                    
                </div>
            </div>
            <div>
                {shifts}
                {shifts.length > 0 && <button type="button" class={style.shift_saveBtn} onClick$={async ()=>{
                    await saveShift.submit({memberShift: memberShift.value})
                }}>Enregistrer</button>}
            </div>
        </main>
    )
})

export const head:DocumentHead = {
    title: "Creer des planning"
}

export default NewShift