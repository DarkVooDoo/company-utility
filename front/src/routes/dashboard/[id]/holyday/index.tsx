import { $, QRL, component$, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import CustomSelect from "~/components/CustomSelect/component"
import { Holyday } from "~/lib/types"
import { BACKEND_HOST } from "~/lib/util"

export const useGetHolydays = routeLoader$(async({params, cookie})=>{
    const token = cookie.get("auth-token")?.value
    if(token){
        const fetchHolyday = await fetch(`${BACKEND_HOST}:5000/api/holyday?companyId=${params.id}`,{
            headers: [["Authorization", token]]
        })
        const holyday = await fetchHolyday.json() as Holyday[]
        return holyday
    }
    return []
})

interface Test {
    value: string
}

const Holyday = component$(()=>{
    const holyday = useGetHolydays()

    const filterStatus = useStore<Test>({value: "Aucun"})

    useVisibleTask$(async ({track})=>{
        track(()=>filterStatus.value)
        console.log("Enter")
        // const holyday = fetch(`${BACKEND_HOST}:5000/api/holyday?status=${filterStatus.value}&companyId=${}`)
    })

    const renderSelection = $((status: string)=>(
        <div onClick$={()=>{
            filterStatus.value = status
        }}>
            <p>{status}</p>
        </div>
    ))

    const holydays = holyday.value.map(holyday=>(
        <div>
            <h3>{holyday.name} </h3>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                    <p>Du</p>
                    <p>{holyday.from} </p>
                </div>
                <div>
                    <p>Au</p>
                    <p>{holyday.to} </p>
                </div>
            </div>
            <p>{holyday.status} </p>
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