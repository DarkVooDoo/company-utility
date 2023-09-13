import Actions from "@/component/Members/Component"
import { GetMyCompany } from "@/util/data"

import Link from "next/link"
import Image from "next/image"
import dollar from "@/public/dollar.webp"
import employees from "@/public/employees.webp"
import user from "@/public/user.webp"
import leftArrow from "@/public/left-arrow.webp"

import style from "./style.module.css"
import UserHolydayCard from "@/component/UserHolydayCard/component"
import JobCard from "@/component/JobCard/component"

export interface DashboardProps{
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

const JOBS = [
    {
        id: "sq",
        name: "React Dev H/F",
        about: `about the job kol its cool`,
        c_id: "322",
        c_name: "Connected"
    },
    {
        id: "sq23",
        name: "Plongeur H/F",
        about: `test its just a about the jib`,
        c_id: "232",
        c_name: "Connected"
    }
]

const Dashboard = async ({params:{id}}:DashboardProps)=>{
    const company = await GetMyCompany(id)
    const shift = Test.map(shift=>(
        <div>
            <h1>{shift.user_name} </h1>
            <p>{shift.shift_start} </p>
            <p>{shift.shift_end} </p>
            <p>{shift.shift_pause} </p>
        </div>
    ))
    const job = JOBS.map(job=><JobCard {...{...job}} />)
    const pendingHolyday = company?.holyday_pending.map(holyday=><UserHolydayCard key={holyday.id} {...{holyday, role: company.role}} />)
    return (
        <main className={style.dashboard}>
            <div className={style.dashboard_company}>
                <Image src={user} alt="photo" />
                <div>
                    <h1>{company?.name}</h1>
                    <p>Adresse {company?.adresse}</p>
                </div>
            </div>
            <div className={style.dashboard_links}>
                <Link href={`/dashboard/${id}/employees`} className={style.dashboard_links_btn} >
                <Image src={employees} alt="dollar" className={style.dashboard_links_btn_icon} />Employées
                </Link>
                <Link href={`/dashboard/${id}/payroll`} className={style.dashboard_links_btn}>
                    <Image src={dollar} alt="dollar" className={style.dashboard_links_btn_icon} />Payments
                </Link>
            </div>
            {/* <div className={style.dashboard_job}>
                <h1>Mes Annonces</h1>
                <Link href={`/dashboard/${id}/new-annonce`} className={style.dashboard_holydays_link}>Noveau <Image src={leftArrow} alt="fleche" className={style.dashboard_holydays_link_arrow} /> </Link>
            </div>
            {job} */}
            <div className={style.dashboard_holydays}>
                <div className={style.dashboard_holydays_header}>
                    <h1>Congés</h1>
                    <Link href="#" className={style.dashboard_holydays_link}>Voir les congés <Image src={leftArrow} alt="fleche" className={style.dashboard_holydays_link_arrow} /> </Link>
                </div>
                <div className={style.dashboard_holydays_all}>
                    {pendingHolyday.length > 0 ? pendingHolyday : "Zero congé a gerer"}
                </div>
            </div>
        </main>
    )
}

export default Dashboard