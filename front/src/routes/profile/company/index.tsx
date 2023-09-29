import { component$ } from "@builder.io/qwik"
import { Form, routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city"


import MyCompanys from "~/components/MyCompanys/component"

import style from "./style.module.css"
import { BACKEND_HOST } from "~/lib/util"
import { Entreprise } from "~/lib/types"

export const useMyCompanys = routeLoader$(async(req)=>{
    const token = req.cookie.get("auth-token")?.value 
    if (token){
        const fetchCompany = await fetch(`${BACKEND_HOST}:5000/api/pro?type=Profile`,{
            headers: [["Authorization", token]]
        })
        return await fetchCompany.json() as {id: string, name: string, adresse: string, postal: number}[]
    }
    return []
  })

export const useCreateCompany = routeAction$(async (form, req)=>{
    const token = req.cookie.get("auth-token")?.value
    if (token){
        const {name, adresse, postal} = form
        const info = {name, adresse, postal: parseInt(postal.toString())}
        const createCompany = await fetch(`${BACKEND_HOST}:5000/api/pro`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({...info})
        })
        if (createCompany.status === 200){
            return {code: 200, msg: "Success"}
        }
    }
}, zod$({
    name: z.string(),
    adresse: z.string(),
    postal: z.string().length(5)
}))

const Company = component$(()=>{
    const companys = useMyCompanys()
    const createCompany = useCreateCompany()
    return (
        <div>
            <Form action={createCompany} >
                <h2>Nouvelle Enreprise</h2>
                <div class={style.input}>
                    <input class={style.input_ele} required type="text" name="name" id="name" autoComplete="off"/>
                    <label class={style.input_label} form="name">Nom</label>
                </div>
                <div class={style.input}>
                    <input class={style.input_ele} required type="text" name="adresse" id="adresse" autoComplete="off" />
                    <label class={style.input_label} form="name">Adresse</label>
                </div>
                <div class={style.input}>
                    <input class={style.input_ele} required type="number" name="postal" id="postal" autoComplete="off" />
                    <label class={style.input_label} form="postal">Postal</label>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button type="submit" class={style.button}>Creer</button>
                </div>
            </Form>
            {companys.value && <MyCompanys {...{companys: companys.value, type: "Profile"}} />}
        </div>
    )
})

export default Company