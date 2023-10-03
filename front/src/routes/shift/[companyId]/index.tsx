import { component$, useContext, useSignal, useStore, useTask$, $} from "@builder.io/qwik"
import { DocumentHead, Link, routeLoader$ } from "@builder.io/qwik-city"
import { GetMonthArray, MONTH, hasChanged, userContext } from "~/lib/util"

import style from "./style.module.css"
import { Calendar, ShiftTypes } from "~/lib/types"

import Trash from "~/media/trash.svg?jsx"
import Edit from "~/media/edit.svg?jsx"
import CustomSelect from "~/components/CustomSelect/component"

export const useGetShift = routeLoader$(async(req)=>{
    const company = req.params.companyId
    const token = req.cookie.get("auth-token")?.value
    return {company, token}
})

const CompanyShift = component$(()=>{
    const [user] = useContext(userContext)
    const data = useGetShift()
    const company = useSignal({token: data.value.token, company: data.value.company})
    const selectedCell = useSignal<number>()
    const userShift = useSignal<{role: {role: string, id: string}, shift: ShiftTypes[]}>({role: {role: "User", id: ""}, shift: []})
    const initial = useSignal<Pick<ShiftTypes, "shift_start" | "shift_end" | "shift_pause">[]>([])
    const displayedShift = useSignal<ShiftTypes[]>([])
    const calendar = useSignal<Calendar[]>([])

    const date = useStore({year: new Date().getFullYear(), month: new Date().getMonth()+1, label: MONTH[new Date().getMonth()]})

    const onEditShift = $(async()=>{
        const hasChange = hasChanged(initial.value, userShift.value.shift, ["shift_end", "shift_pause", "shift_start"])
        const editShift = await fetch(`http://localhost:5000/api/shift`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({shifts: hasChange[1]})
        })
        if(editShift.status === 200 ){
            // setPopupMessage({isSuccess: true, message: "Planning modifié"})
        }
    })

    const onDeleteShift = $(async(id: string)=>{
        const deleteShift = await fetch(`http://localhost:5000/api/shift`,{
            method: "DELETE",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({id})
        })
        if (deleteShift.status === 200){
            const newShift = userShift.value.shift.filter(shift=>shift.shift_id != id)
            displayedShift.value = displayedShift.value?.filter(shift=>shift.shift_id != id)
            userShift.value = {...userShift.value, shift: newShift}
            initial.value = newShift
        }
    })

    const onShiftChange = $((newShift: ShiftTypes)=>{
        const shiftIndex = userShift.value.shift.findIndex(myShift=>myShift.shift_id === newShift.shift_id)
        userShift.value.shift[shiftIndex] = newShift
        userShift.value = {...userShift.value, shift: [...userShift.value.shift]}
        userShift.value.shift = [...userShift.value.shift]
    })

    useTask$(async({track})=>{
        track(()=>{
            return {month: date.month, year: date.year, company: data.value.company}
        })
        selectedCell.value = undefined
        displayedShift.value = []
        const buildedCalendar = GetMonthArray(new Date().getFullYear(), date.month-1)
        calendar.value = buildedCalendar.calendar
        if (data.value.company && data.value.token){
            console.log("fetching")
            const fetchShift = await fetch(`http://localhost:5000/api/shift?companyId=${data.value.company}&from=${buildedCalendar.from}&to=${buildedCalendar.to}`,{
                headers: [["Authorization", data.value.token]]
            }) 
            if (fetchShift.status === 204){
                userShift.value = {role: {role: "User", id: ""}, shift: []}
            }else{
                const shift = await fetchShift.json() as {role: {role: string, id: string}, shift: ShiftTypes[]}
                if(shift){
                    userShift.value = shift
                    // userShift.value = [...shift.shift]
                    initial.value = [...shift.shift]
                }
                const calendarMonth = buildedCalendar.calendar[buildedCalendar.calendar.findIndex(calendar=>calendar.isCurrentMonth)]
                if (calendarMonth.month === new Date().getMonth()){
                    const date = new Date()
                    const showShift = shift.shift.filter(shift=>shift.shift_day === date.getDate() && shift.shift_month === calendarMonth.month+1)
                    displayedShift.value = showShift
                    selectedCell.value = buildedCalendar.calendar.findIndex(calendar=> calendar.isCurrentMonth && calendar.dayNumber === date.getDate())
                }else{selectedCell.value = undefined}
            }
        }
    })
    const month = new Array(12).fill(0).map((_,index)=>index)
    const renderMonths = $((month: number)=>(
        <div style={date.month-1 === month ? {backgroundColor: "darkgray"} : {}} onClick$={()=>{
            date.label = MONTH[month]
            date.month = month + 1
        }}>
            <p>{MONTH[month]} </p>
        </div>
    ))
    const days = calendar.value.map((day, index)=>{
        const userExist = userShift.value.shift.findIndex(shift=>shift.shift_day === day.dayNumber && shift.user_id === user.value.user_id && shift.shift_month-1 === day.month)
        if (userExist != -1){
            return (
                <button disabled={day.isCurrentMonth ? false : true} 
                type="button" key={index} class={[style.shift_calendar_day, userShift.value.shift[userExist].user_id === user.value.user_id ? style.shift_active : "", selectedCell.value === index && style.selected]} onClick$={()=>{
                    const shifts = userShift.value.shift.filter(shift=>shift.shift_day === day.dayNumber && day.month === shift.shift_month-1)
                    displayedShift.value = shifts
                    selectedCell.value = index
                }} >{day.dayNumber} </button>
            )
        }
        return (
            <button disabled={!day.isCurrentMonth} type="button" key={index} class={[style.shift_calendar_day, selectedCell.value === index && style.selected]} onClick$={()=>{
                const shifts = userShift.value.shift.filter(shift=>shift.shift_day===day.dayNumber && day.month === shift.shift_month-1)
                displayedShift.value = shifts
                selectedCell.value = index
            }} >{day.dayNumber} </button>
        )
    })
    const isAdmin = userShift.value.role.role === "Boss" || userShift.value.role.role === "Admin" ? true : false
    const displayDayShift = displayedShift.value && displayedShift.value.map(shift=><DisplayShift key={shift.shift_id} {...{shift, isAdmin, onDeleteShift, onShiftChange}} />)
    return (
        <div class={style.shift}>
            <div class={style.shift_header}>
                {isAdmin && <Link href={`/shift/${company.value.company}/new`} class={style.header_planningBtn} >Creer un planning</Link>}
                <CustomSelect items={month} value={date.label} renderOption={renderMonths} />
            </div>
            <div class={style.shift_calendar}>
                {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map(name=>(<p key={name} class={style.shift_calendar_dayName}>{name} </p>))}
                {days}
            </div>
            {hasChanged(initial.value, userShift.value.shift, ["shift_start", "shift_end", "shift_pause"])[0] ? <button type="button" class={style.shift_date_editBtn} onClick$={onEditShift}><Edit alt="edit" class={style.shift_date_editBtn_icon} /></button> : null}
            {displayDayShift}
        </div>
    )
})

interface DisplayShiftProps {shift: ShiftTypes, isAdmin: boolean, onDeleteShift: (id: string)=>void, onShiftChange: (newShift: ShiftTypes)=>void}

const DisplayShift = component$<DisplayShiftProps>(({isAdmin, onDeleteShift, onShiftChange, shift})=>{
    const start = useSignal(shift.shift_start)
    const end = useSignal(shift.shift_end)
    const pause = useSignal(shift.shift_pause)
    return (
        <div key={shift.shift_id} class={style.shift_display_shift}>
            <div class={style.shift_display_shift_name}>
                <h3>{shift.user_name} </h3>
                {isAdmin && <Trash alt="supprimer" class={style.shift_display_shift_name_supprimer} onClick$={()=>onDeleteShift(shift.shift_id)} />}
            </div>
            <div>  
                <p class={style.shift_display_label}>Commence</p>
                <input type="time" name="start" value={start.value} class={style.shift_display_content} readOnly={isAdmin ? false : true}
                onChange$={({target: {value}})=>{
                    start.value = value
                    onShiftChange({...shift, shift_start: value, shift_end: end.value, shift_pause: pause.value})
                }}/>
            </div>
            <div>
                <p class={style.shift_display_label}>Finis</p>
                <input type="time" value={end.value} class={style.shift_display_content} readOnly={isAdmin ? false : true}
                onChange$={({target: {value}})=>{
                    end.value = value
                    onShiftChange({...shift, shift_start: start.value, shift_end: value, shift_pause: pause.value})
                }}/>
            </div>
            <div>
                <p class={style.shift_display_label}>Pause</p>
                <input type="number" name="pause" id="pause" value={pause.value.toString()} class={style.shift_display_content} readOnly={isAdmin ? false : true}
                onChange$={({target: {value}})=>{
                    pause.value = parseInt(value)
                    onShiftChange({...shift, shift_start: start.value, shift_end: end.value, shift_pause: parseInt(value)})
                }}/>
            </div>
        </div>
    )
})

export const head:DocumentHead = ()=>{
    return {
        title: "Planning"
    }
}

export default CompanyShift