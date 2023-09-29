import { Slot, component$ } from "@builder.io/qwik"
import MyCompanys from "~/components/MyCompanys/component"
import { DocumentHead, routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city"
import { BACKEND_HOST } from "~/lib/util"

export const useUserCompany = routeLoader$(async (req)=>{
    const token = req.cookie.get("auth-token")?.value
    if (token){
        const fetchCompany = await fetch(`${BACKEND_HOST}:5000/api/pro?type=User`,{
            headers: [["Authorization", token]]
        })
        return await fetchCompany.json() as {id: string, name: string, adresse: string, postal: number}[]
    }
    return []
})

const HomeLayout = component$(()=>{
    const companys = useUserCompany()
    return (
        <div>
            <MyCompanys {...{companys: companys.value, type: "User"}} />
            <Slot />
        </div>
    )
})

export const head: DocumentHead = ()=>{
    return {
        title: "Connected",
        meta: [
            {
            name: "description",
            content: "Qwik site description",
            },
        ],
    }
}

export const useRequestHolyday = routeAction$(async(form, req)=>{
    const token = req.cookie.get("auth-token")?.value
    const companyId = req.cookie.get("company-id")?.value
    const {holydayType, dates} = form
    if(token && companyId && holydayType){
        const sendHolydayRequest = await fetch(`${BACKEND_HOST}:5000/api/holyday`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({from: dates[0], to: dates[1], companyId: companyId, type: holydayType})
        })
        if (sendHolydayRequest.status === 200){
            return {success: true}
        }

    }
}, zod$({
    holydayType: z.string(),
    dates: z.array(z.string()).length(2)
}))



export default HomeLayout