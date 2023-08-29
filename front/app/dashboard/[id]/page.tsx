import Actions from "@/component/Members/Component"
import { GetMyCompany } from "@/util/data"
import {ROLE} from "@/util/lib"

import Link from "next/link"
import Image from "next/image"
import leftArrow from "@/public/left-arrow.webp"

import style from "./style.module.css"
import { onAcceptHolyday, onRejectHolyday } from "@/app/actions"
import UserHolydayCard from "@/component/UserHolydayCard/component"

interface Props{
    params:{id: string}
}

const Test = [
    {
        user_name: "Justin TV",
        shift_id: "2323",
        shift_start: "10:00",
        shift_end: "22:00",
        shift_pause: 30,
    },
    {
        user_name: "John Bravo",
        shift_id: "233",
        shift_start: "10:00",
        shift_end: "22:00",
        shift_pause: 30,
    },
    {
        user_name: "John Doe",
        shift_id: "232",
        shift_start: "10:00",
        shift_end: "22:00",
        shift_pause: 30,
    }
]

const Dashboard = async ({params:{id}}:Props)=>{
    const company = await GetMyCompany(id) as  {
        role: ROLE,
        name: string, adresse: string, holyday_pending: {id: string, from: string, to: string, status: string, name: string, time: string}[], 
        members: {id: string, name: string, role: string}[]
    }
    const shift = Test.map(shift=>(
        <div>
            <h1>{shift.user_name} </h1>
            <p>{shift.shift_start} </p>
            <p>{shift.shift_end} </p>
            <p>{shift.shift_pause} </p>
        </div>
    ))
    const pendingHolyday = company.holyday_pending.map(holyday=><UserHolydayCard key={holyday.id} {...{holyday, role: company.role}} />)
    return (
        <main>
            <h1>{company.name}</h1>
            <p>Adresse {company.adresse}</p>
            <h1>Planning Aujourd'hui</h1>
            {/* {shift} */}
            <div className={style.dashboard_holydays}>
                <div className={style.dashboard_holydays_header}>
                    <h1>Congés</h1>
                    <Link href="#" className={style.dashboard_holydays_link}>Voir les congés <Image src={leftArrow} alt="fleche" className={style.dashboard_holydays_link_arrow} /> </Link>
                </div>
                <div className={style.dashboard_holydays_all}>
                    {pendingHolyday}
                </div>
                {/* <h1>John Doe</h1>
                <p>demande de congé payé du 22 Juillet au 30 Juillet</p>
                <div className={style.dashboard_holydays_controls}>
                    <button type="button" className={style.dashboard_holydays_controls_btn}>Refusé</button>
                    <button type="button" className={style.dashboard_holydays_controls_btn}>Accepté</button>
                </div> */}
            </div>
            <Actions {...{members: company.members}} />
        </main>
    )
}

export default Dashboard