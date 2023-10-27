import { component$ } from "@builder.io/qwik"

import style from "./style.module.css"
import { Form, routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city"
import { BACKEND_HOST } from "~/lib/util"
import { CompanySetting } from "~/lib/types"

export const useGetSetting = routeLoader$(async ({cookie})=>{
    const token = cookie.get("auth-token")?.value
    const cId = cookie.get("company-id")?.value
    if(token){
        const getSetting = await fetch(`${BACKEND_HOST}:5000/api/pro?cId=${cId}`,{
            headers: [["Authorization", token], ["x-path", "setting"]]
        })
        return await getSetting.json() as CompanySetting
    }
})

export const useUpdateCompany = routeAction$(async (form, {cookie, params})=>{
    const token = cookie.get("auth-token")?.value
    console.log(form)
    console.log(params.id)
    if (token){
        const updateCompany = await fetch(`${BACKEND_HOST}:5000/api/pro`,{
            method: "PATCH",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({...form, id: params.id})
        })
    }
}, zod$({
    adresse: z.string(),
    siret: z.string(),
    ape: z.string(),
    postal: z.string(),
    urssaf: z.string()
}))

const Setting = component$(()=>{
    const data = useGetSetting()
    const updateCompany = useUpdateCompany()
    return (
        <Form action={updateCompany}>
            <h1>Parametre</h1>
            <div class={style.setting_field}>
                <label for="adresse">Adresse</label>
                <input type="text" name="adresse" id="adresse" class={style.setting_field_input} value={data.value?.adresse} />
            </div>
            <div class={style.setting_field}>
                <label for="postal">Postal</label>
                <input type="text" name="postal" id="postal" class={style.setting_field_input} value={data.value?.postal} />
            </div>
            <div class={style.setting_field}>
                <label for="siret">Siret</label>
                <input type="text" name="siret" id="siret" class={style.setting_field_input} value={data.value?.siret} />
            </div>
            <div class={style.setting_field}>
                <label for="ape">Code Ape/ape</label>
                <input type="text" name="ape" id="ape" class={style.setting_field_input} value={data.value?.ape} />
            </div>
            <div class={style.setting_field}>
                <label for="urssaf">Urssaf/Msa</label>
                <input type="text" name="urssaf" id="urssaf" class={style.setting_field_input} value={data.value?.urssaf} />
            </div>
            <button type="submit">Enregistrer</button>
        </Form>
    )
})

export default Setting