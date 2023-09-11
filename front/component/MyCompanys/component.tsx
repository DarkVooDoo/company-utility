"use client"

import { CreateCookie, GetCookie } from "@/util/lib"
import { useEffect, useState } from "react"
import {useRouter} from "next/navigation"

import Image from "next/image"
import Company from "@/public/companie.webp"

import style from "./style.module.css"

interface Props{
    companys: {id: string, name: string, adresse: string, postal: number}[],
    type: "Shift" | "Profile" | "User",
    onCompanyChange?: (id: string)=>void
}

const MyCompanys:React.FC<Props> = ({companys, type, onCompanyChange = ()=>{}})=>{
    const [selectedCompany, setSelectedCompany] = useState<string>()
    const router = useRouter()
    const onCompanyClick = async (id: string)=>{
        if(type === "Shift"){
            onCompanyChange(id)
        }else if(type === "Profile"){
            router.push(`/dashboard/${id}`)
        }else{
            router.push(`/home/${id}`)
        }
        setSelectedCompany(id)
        CreateCookie("company-id", id, 60*60*24*200)
    }

    useEffect(()=>{
        setSelectedCompany(GetCookie("company-id"))
    },[])

    const company = companys.map(company=>(
        <div key={company.id} style={{boxShadow: selectedCompany === company.id ? "0px 0px 10px 0px var(--Primary-Color)" : "0px 0px 5px 0px black"}} className={style.shift_company_box} onClick={()=>onCompanyClick(company.id)}>
            <Image src={Company} alt="entreprise" className={style.shift_company_box_icon} />
            <h4>Entreprise</h4>
            <h3>{company.name} </h3>
            <p>{company.adresse}, {company.postal} </p>
        </div>
    ))
    return (
        <div className={style.shift}>
            <h1>Entreprises</h1>
            <div className={style.shift_company} style={company.length === 0 ? {justifyContent: "center"} : {}}>
                {company.length > 0 ? <div className={style.shift_company_inner}>
                    {company}
                </div> : <h3>Aucune entreprise enregistrer</h3>}
            </div>
        </div>
    )
}

export default MyCompanys