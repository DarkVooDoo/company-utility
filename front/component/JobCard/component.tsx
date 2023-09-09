"use client"

import Link from "next/link"

import style from "./style.module.css"

interface Props{
    id: string
    name: string
    about: string
    c_id: string
    c_name: string
}

const JobCard:React.FC<Props> = ({id, name, about, c_name})=>{
    return (
        <div className={style.job}>
            <Link href="#"><h3 className={style.job_name}>{name} </h3></Link>
            <p className={style.job_company}>{c_name} </p>
            <p>{about} </p>
        </div>
    )
}

export default JobCard