"use client"
import { useEffect, useState } from "react"
import style from "@/app/search/style.module.css"

import Image from "next/image"
import user from "@/public/user.webp"

interface Props{
    user_amount: number, 
    company_amount: number, 
    users: {id: string, name: string}[], 
    companys: {id: string, name: string}[]
}

const Search:React.FC<Props> = ({company_amount, companys, user_amount, users})=>{
    const [onglet, setOnglet] = useState(0)
    const [display, setDisplay] = useState<React.ReactNode>(null)
    useEffect(()=>{
        if (onglet === 0){
            const user = users.map(user=><SearchCard key={user.id} {...{...user}} />)
            setDisplay(user)
        }else if (onglet === 1){
            const company = companys.map(company=><SearchCard key={company.id} {...{...company}} />)
            setDisplay(company)
        }else{
            setDisplay(null)
        }
    }, [onglet])
    return (
        <> 
            <div className={style.search_amount}>
                <button onClick={()=>{
                    setOnglet(0)}}>
                    <p>Utilisateur ({user_amount} )</p>
                </button>
                <button onClick={()=>setOnglet(1)}>
                    <p>Entreprises ({company_amount})</p>
                </button>
                <div>
                    <p>Annonces (4)</p>
                </div>
            </div>
            {display}
        </>
    )
}


interface CardProps {
    id: string 
    name: string
}
const SearchCard:React.FC<CardProps> = ({name})=>{
    return (
        <div className={style.search_card}>
            <Image src={user} alt="photo" />
            <h3>{name}</h3>
        </div>
    )
}

export default Search