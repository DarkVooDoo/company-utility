import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik"
import { Form, Link, routeAction$, routeLoader$, z, zod$} from "@builder.io/qwik-city"
import { BACKEND_HOST, MONTH, SecondsToHour, closeDialogOnBackdropClick } from "~/lib/util"

import Left from "~/media/left-arrow.webp?jsx"
import Start from "~/media/start.webp?jsx"
import Pause from "~/media/pause.webp?jsx"

import style from "./style.module.css"

import UserHolydayCard from "~/components/UserHolydayCard/component"
import Calendar from "~/components/Calendar/component"
import { useRequestHolyday } from "../layout"
import type { CurrentShift, Holyday } from "~/lib/types"

const INFOS = {
    paye: `Vous bénéficiez des congés payés quel que soit votre contrat de travail 
    (CDI: CDI : Contrat de travail à durée indéterminée, CDD: CDD : Contrat à durée déterminée ou contrat d'intérim).`,
    maternite: `Vous êtes salariée en activité et vous êtes enceinte ? Vous bénéficiez d'un congé de maternité qui comporte une période avant 
    votre accouchement (dit congé prénatal) et une période après votre accouchement (dit congé postnatal).`
}

export const useGetTodayShift = routeLoader$(async (req)=>{
    const [day, month, year] = new Date().toLocaleDateString().split("/")
    const token = req.cookie.get("auth-token")?.value
    const id = req.cookie.get("id")?.value
    if (token){
        const fetchShift = await fetch(`${BACKEND_HOST}:5000/api/shift?date=${year}-${month}-${day}&company=${req.cookie.get("company-id")?.value}&userId=${id}`,{
            headers: [["Authorization", token], ["Accept", "application/json"]]
        })
        if (fetchShift.status === 200){
            return await fetchShift.json() as {start: string, end: string, pause: number}
        }
    }
    return undefined
})

export const useGetMyHolydays = routeLoader$(async(req)=>{
    const token = req.cookie.get("auth-token")?.value
    if (token){
      const fetchHolyday = await fetch(`${BACKEND_HOST}:5000/api/holyday?companyId=${req.params.companyId}`,{
        headers: [["Authorization", token]]
      })
      if (fetchHolyday.status === 200) return await fetchHolyday.json() as Holyday[]
    }
    return []
})

export const useGetCurrentShift = routeLoader$(async(req):Promise<CurrentShift | undefined>=>{
    const token = req.cookie.get("auth-token")?.value
    const companyId = req.cookie.get("company-id")?.value
    if (!token || !companyId) return
    const shift = await fetch(`${BACKEND_HOST}:5000/api/tracker?companyId=${companyId}`,{
        headers: [["Authorization", token]]
    })
    if (shift.status == 200){
        const currentShift = await shift.json() as CurrentShift
        return currentShift
    }
    return undefined
    
})

export const useStartShift = routeAction$(async (form, req)=>{
    const companyId = req.cookie.get("company-id")?.value
    const token = req.cookie.get("auth-token")?.value
    const {shift, id: shiftId, state, hourId, type} = form
    if(token){
        await fetch(`http://localhost:5000/api/tracker`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({companyId, state: shift ?  undefined : state, shiftId: shift ? undefined : shiftId, hourId: shift ? undefined : hourId, type})
        })
    }
})

export const useEndShift = routeAction$(async(form, req)=>{
    const companyId = req.cookie.get("company-id")?.value
    const token = req.cookie.get("auth-token")?.value
    const {id: shiftId, state, hourId, type} = form
    if(token){
        await fetch(`http://localhost:5000/api/tracker`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({companyId, shiftId, hourId, state, type})
        })
    }
})

export const usePauseShift = routeAction$(async(form, req)=>{
    const companyId = req.cookie.get("company-id")?.value
    const token = req.cookie.get("auth-token")?.value
    const {id: shiftId, hourId} = form
    if(token){
        await fetch(`http://localhost:5000/api/tracker`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({companyId, shiftId, hourId})
        })
    }
})

const Home = component$(()=>{
    const requestHolyday = useRequestHolyday()
    const holyday = useGetMyHolydays()
    const startShift = useStartShift()
    const pauseShift = usePauseShift()
    const endShift = useEndShift()
    const todayShift = useGetTodayShift()
    const currentShift = useGetCurrentShift()
    const seconds = useSignal(0)
    const dialogRef = useSignal<HTMLDialogElement>()
    const holydayType = useSignal<string>()
    const dates = useSignal<string[]>([])
    const onChange = $((date: string[])=>{
        dates.value = date
    })
    
    useVisibleTask$(({track})=>{
        track(()=>currentShift.value)
        seconds.value = currentShift.value?.seconds || 0
        if(currentShift.value?.seconds && currentShift.value.state === "En Cours"){
            const timer = setInterval(()=>{
                seconds.value = seconds.value + 1 
            },1000)
            return ()=>{
                clearInterval(timer)
            }
        }
        
    })

    const dayOff = holyday.value.map(holyday=><UserHolydayCard key={holyday.id} {...{holyday, role: {id: "0", role: "User"}}} />)
    return (
        <div class={style.landpage}> 
            <div class={style.landpage_shift}>
                <div class={style.landpage_shiftHeader}>
                    <h1 class={style.landpage_shiftHeader_text}>Aujourd'hui</h1>
                    <Link href="/shift" class={style.landpage_shiftHeader_link}>Mon Planning <Left alt="arrow" class={style.landpage_shiftHeader_link_arrow} /></Link>
                </div>
                <div class={style.landpage_shift_card}>
                    <div class={style.landpage_shift_date}>
                        <svg
                            width="16.933332mm"
                            height="13.962574mm"
                            viewBox="0 0 16.933332 13.962574"
                            version="1.1">
                            <defs
                            id="defs2" />
                            <g
                            id="layer1"
                            transform="translate(-64.276115,-113.03731)">
                            <rect
                                style={{opacity: 1, fill: "#d7d7d7", fillOpacity: 1, strokeWidth: "0.53198", strokeLinecap: "round", strokeLinejoin: "round"}}
                                id="rect184"
                                width="16.933332"
                                height="13.962574"
                                x="64.276115"
                                y="113.03731"
                                ry="1.5596498" />
                            <path
                                id="rect2763"
                                style={{opacity: 1, fill: "#000000", fillOpacity: 1, strokeWidth: "0.53198", strokeLinecap: "round", strokeLinejoin: "round"}}
                                d="m 65.835715,113.03735 c -0.864046,0 -1.559587,0.69555 -1.559587,1.55959 v 1.11408 h 16.933318 v -1.11408 c 0,-0.86404 -0.695644,-1.55959 -1.559691,-1.55959 z" />
                            <text
                                style={{fontWeight: "bold", fontSize: "10.2134px", fontFamily: "sans-serif", opacity: 1, fill: "#000000", fillOpacity: 1, strokeWidth: "0.53198",strokeLinecap:"round",strokeLinejoin: "round"}}
                                x="67"
                                y="124.91429"
                                id="text2871"><tspan
                                id="tspan2869"
                                style={{fontSize: "10.2134px", fill: "#000000", fillOpacity: 1, strokeWidth: "0.531982"}}
                                x="67"
                                y="124.91429">{new Date().getDate() < 10 ? "0"+new Date().getDate() : new Date().getDate()} </tspan></text>
                            </g>
                        </svg>
                        <div> 
                            <h2 class={style.landpage_shift_date_day}>{MONTH[new Date().getMonth()]} </h2>
                            {todayShift.value ? <div class={style.landpage_shift_time}>
                                <div>
                                    {/* <Image src={s} alt="start" class={style.shift_time_content_icon} /> */}
                                    <h3>{todayShift.value.start} </h3>
                                </div>
                                <div>
                                    {/* <Image src={exit} alt="exit" class={style.shift_time_content_icon} /> */}
                                    <h3>{todayShift.value.end} </h3>
                                </div>
                                <div class={style.shift_time_content}>
                                    {/* <Image src={pause} alt="pause" class={style.shift_time_content_icon} /> */}
                                    <h3>{todayShift.value.pause} mins</h3>
                                </div>
                            </div> : <h3>Vous etes libre</h3>}
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <h1>{SecondsToHour(seconds.value || 0)}</h1>
                        {!currentShift.value ?
                                <button disabled={startShift.isRunning ? true : false}
                                    onClick$={async ()=>{
                                        await startShift.submit({shift: undefined, type: "Started"})
                                        // navigator.geolocation.getCurrentPosition(async (e)=>{
                                        //     console.log(e)
                                        // }, null, {enableHighAccuracy: true})
                                    }}
                                    class={style.landpage_shift_date_startShift}>
                                        <h4>Start</h4>
                                        <Start alt="commencer" class={style.landpage_shift_date_startShift_icon} />
                                </button>
                            : <div style={{display: "flex", gap: "1rem"}}>
                                {currentShift.value.state == "En Pause" ? <>
                                        <button disabled={startShift.isRunning ? true : false} name="shift" class={style.landpage_shift_date_startShift} onClick$={ ()=>{
                                            startShift.submit({...currentShift.value, type: "Return"})
                                        }}>
                                            <h4>Reprendre</h4>
                                            <Start alt="commencer" class={style.landpage_shift_date_startShift_icon} />
                                        </button>
                                        <button disabled={endShift.isRunning ? true : false} name="shift" class={style.landpage_shift_date_startShift} onClick$={()=>{
                                            endShift.submit({...currentShift.value, type: "Stopped"})
                                        }}>
                                            <h4>Finir</h4>
                                        </button>
                                    </>
                                : <>
                                    <button disabled={pauseShift.isRunning ? true : false} name="shift" class={style.landpage_shift_date_startShift} onClick$={async ()=>{
                                            await pauseShift.submit({...currentShift.value})
                                        }}>
                                        <h4>Pause</h4>
                                        <Pause alt="pause" class={style.landpage_shift_date_startShift_icon} />
                                    </button>
                                    <button disabled={endShift.isRunning ? true : false} name="shift" class={style.landpage_shift_date_startShift} onClick$={async()=>{
                                            await endShift.submit({...currentShift.value, type: "Stopped"})
                                        }}>
                                        <h4>Finir</h4>
                                        {/* <Image src={stop} alt="commencer" class={style.landpage_shift_date_startShift_icon} /> */}
                                    </button>
                            </> }
                        </div>}
                    </div>
                </div>
            </div> 
            <div class={style.holyday}>
                <div class={style.holyday_header}>
                    <h1 class={style.holyday_header_text}>Congés</h1>
                    <button type="button" class={style.holyday_header_btn} onClick$={()=>{
                        if (dialogRef.value){
                            dialogRef.value.showModal()
                            closeDialogOnBackdropClick(dialogRef.value)
                        }
                    }} >Demander un congé <Left alt="arrow" class={style.holyday_header_btn_arrow} /></button>
                </div>
                {holyday.value.length > 0 ? <>{dayOff} </> : <div class={style.holyday_nocontent}>
                    Vous avez aucun congé
                </div>}
                <dialog ref={dialogRef} class={style.holyday_dialog}> 
                    <div class={style.holyday_dialog_form}>
                        <Calendar {...{currentUser: "",type: "between", onChange, hasMin: true, clasStyle: style.holyday_dialog_form_calendar}} />
                        <div class={style.holyday_type}>
                            <div class={style.holyday_dialog_radio}>
                                <p>Congé Payé <button class={style.holyday_dialog_radio_infoBtn} data-title={INFOS.paye}>!</button></p>
                                <input type="radio" name="holyday" id="conge-payé" value={"Congé Payé"} onChange$={(e)=>{
                                    holydayType.value = e.target.value
                                }} />
                                <label for="conge-payé" class={style.holyday_dialog_radio_label} />
                            </div>
                            <div class={style.holyday_dialog_radio}>
                                <p>Maternité <button class={style.holyday_dialog_radio_infoBtn} data-title={INFOS.maternite}>!</button></p>
                                <input type="radio" name="holyday" id="maternité" value={"Matérnite"} onChange$={(e)=>{
                                    holydayType.value = e.target.value
                                }} />
                                <label for="maternité" class={style.holyday_dialog_radio_label} />
                            </div>
                            <button class={style.holyday_dialog_sendBtn} onClick$={async()=>{
                                if (!holydayType.value) return
                                await requestHolyday.submit({holydayType: holydayType.value, dates: dates.value})
                                dialogRef.value?.close()
                            }}>Envoyer</button>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    )
})

export default Home

