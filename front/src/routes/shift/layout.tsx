import { Slot, component$ } from "@builder.io/qwik"
import MyCompanys from "~/components/MyCompanys/component"
import { routeLoader$ } from "@builder.io/qwik-city"
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

const ShiftLayout = component$(()=>{
    const companys = useUserCompany()
    return (
        <>
            <MyCompanys {...{companys: companys.value, type: "Shift"}} />
            <Slot />
        </>
    )
})

export default ShiftLayout