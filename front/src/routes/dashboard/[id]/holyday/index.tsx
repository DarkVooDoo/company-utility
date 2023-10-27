import { $, component$, useSignal, useStore, useTask$ } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import CustomSelect from "~/components/CustomSelect/component"

import style from "./style.module.css"
import { Holyday } from "~/lib/types"
import { BACKEND_HOST } from "~/lib/util"

export const useGetHolydays = routeLoader$(async({params, cookie})=>{
    const token = cookie.get("auth-token")?.value
    return {token, companyId: params.id}
})

interface Test {
    value: string
}

const Holyday = component$(()=>{
    const param = useGetHolydays()
    const holyday = useSignal<Holyday[]>([])
    const filterStatus = useStore<Test>({value: "Aucun"})

    useTask$(async ({track})=>{
        track(()=>filterStatus.value)
        if(param.value.token){
            const fetchHolyday = await fetch(`${BACKEND_HOST}:5000/api/holyday?companyId=${param.value.companyId}&status=${filterStatus.value}`,{
                headers: [["Authorization", param.value.token]]
            })
            const holydayPayload = await fetchHolyday.json() as Holyday[]
            holyday.value = holydayPayload
        }
    })

    const renderSelection = $((status: string)=>(
        <div onClick$={()=>{
            filterStatus.value = status
        }}>
            <p>{status}</p>
        </div>
    ))

    const holydays = holyday.value.map(holyday=>(
        <div key={holyday.id} class={style.holyday_card}>
            <div class={style.holyday_card_name}>
                <h3>{holyday.name} </h3>
                <p class={style.holyday_card_name_status} style={holyday.status === "Validé" ? {backgroundColor: "green"} : holyday.status === "Refusé" ? {backgroundColor: "red"} : {backgroundColor: "orange"}} >{holyday.status} </p>
            </div>
            <div class={style.holyday_card_time}>
                <div>
                    <p>Du</p>
                    <p>{holyday.from} </p>
                </div>
                <div>
                    <p>Au</p>
                    <p>{holyday.to} </p>
                </div>
            </div>
        </div>
    ))
    return (
        <div>
            <div>
                <h1>Congés</h1>
                <CustomSelect items={["Aucun", "Validé", "Refusé", "En Attente"]} value={filterStatus.value} renderOption={renderSelection} />
            </div>
            {holydays}
        </div>
    )
})

export default Holyday