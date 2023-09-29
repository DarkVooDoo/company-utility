import { RequestHandler, routeLoader$, useNavigate } from "@builder.io/qwik-city"
import style from "./style.module.css"
import { component$, useSignal, $, useTask$, useVisibleTask$ } from "@builder.io/qwik"
import { BACKEND_HOST, CreateCookie, GetCookie } from "~/lib/util"

interface Props{
    companys: {id: string, name: string, adresse: string, postal: number}[],
    type: "Shift" | "Profile" | "User",
    onCompanyChange?: (id: string)=>void
}

const MyCompanys = component$<Props>(({companys, type})=>{
    const nav = useNavigate()
    const selectedCompany = useSignal<string>()

    useVisibleTask$(()=>{
        selectedCompany.value = GetCookie("company-id")
    })
    const onCompanyClick = $(async (id: string)=>{
        selectedCompany.value = id
        CreateCookie("company-id", id, 60*60*24*7, "/")
        if(type === "Shift"){
            nav(`/shift/${id}`, {forceReload: true})
        }else if(type === "Profile"){
            nav(`/dashboard/${id}`, {type: "link"})
        }else{
            nav(`/home/${id}`)
        }
    })
    const company = companys.map(company=>(
        <div key={company.id} onClick$={()=>onCompanyClick(company.id)}
        style={{boxShadow: selectedCompany.value === company.id ? "0px 0px 10px 0px var(--Primary-Color)" : "0px 0px 5px 0px black"}} 
        class={style.shift_company_box}>
            {/* <Image src={Company} alt="entreprise" className={style.shift_company_box_icon} /> */}
            <h3>{company.name} </h3>
            <p>{company.adresse}, {company.postal} </p>
        </div>
    ))
    return (
        <div class={style.shift}>
            <h1>Entreprises</h1>
            <div class={style.shift_company} style={company.length === 0 ? {justifyContent: "center"} : {}}>
                {company.length > 0 ? <div class={style.shift_company_inner}>
                    {company}
                </div> : <h3>Aucune entreprise enregistrer</h3>}
            </div>
        </div>
    )
})

    


export default MyCompanys