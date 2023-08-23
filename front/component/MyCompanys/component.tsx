"use client"

import { CreateCookie, GetCookie } from "@/util/lib"
import { useEffect, useState } from "react"
import {useRouter} from "next/navigation"

import Link from "next/link"

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
            setSelectedCompany(id)
            onCompanyChange(id)
        }else if(type === "Profile"){
            router.push(`/dashboard/${id}`)
        }else{
            router.push(`/home/${id}`)
        }
        CreateCookie("company-id", id, 60*60*24*200)
    }

    useEffect(()=>{
        setSelectedCompany(GetCookie("company-id"))
    },[])

    const company = companys.map(company=>(
        <div key={company.id} style={{outline: selectedCompany === company.id ? "1px solid black" : "1px solid transparent"}} className={style.shift_company_box} onClick={()=>onCompanyClick(company.id)}>
            <Image src={Company} alt="entreprise" className={style.shift_company_box_icon} />
            <h4>Entreprise</h4>
            <h3>{company.name} </h3>
            <p>{company.adresse}, {company.postal} </p>
        </div>
    ))
    return (
        <div className={style.shift}>
            <h1>Entreprises</h1> 
            <div className={style.shift_company}>
                <div className={style.shift_company_inner}>
                    {company}
                </div>
            </div>
        </div>
    )
}

export default MyCompanys