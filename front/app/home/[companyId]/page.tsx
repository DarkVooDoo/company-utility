

import Link from "next/link"
import Image from "next/image"

import exit from "@/public/exit.svg"
import pause from "@/public/pause.svg"

import style from "./style.module.css"
import { GetTodayShift, GetHolyday } from "@/util/data"
import { MONTH } from "@/util/lib"
import Holydays from "@/component/Holydays/component"
import { Holyday } from "@/util/type"

const HomeCompany = async ()=>{

    const shift = await GetTodayShift() as {start: string, end: string, pause: number}
    const holydays = await GetHolyday() as Holyday[] || []
    return (
        <div>
            <div className={style.landpage_shiftHeader}>
                <h1 className={style.landpage_shiftHeader_text}>Aujourd'hui</h1>
                <Link href="/shift" className={style.landpage_shiftHeader_link}>Mon Planning</Link>
            </div>
            <div className={style.landpage_shift}>
            
                <div className={style.landpage_shift_date}>
                <svg
                    width="16.933332mm"
                    height="13.962574mm"
                    viewBox="0 0 16.933332 13.962574"
                    version="1.1">
                    <defs
                    id="defs2" />
                    <g
                    id="layer1"
                    transform="translate(-64.276115,-113.03731)">
                    <rect
                        style={{opacity: 1, fill: "#d7d7d7", fillOpacity: 1, strokeWidth: "0.53198", strokeLinecap: "round", strokeLinejoin: "round"}}
                        id="rect184"
                        width="16.933332"
                        height="13.962574"
                        x="64.276115"
                        y="113.03731"
                        ry="1.5596498" />
                    <path
                        id="rect2763"
                        style={{opacity: 1, fill: "#000000", fillOpacity: 1, strokeWidth: "0.53198", strokeLinecap: "round", strokeLinejoin: "round"}}
                        d="m 65.835715,113.03735 c -0.864046,0 -1.559587,0.69555 -1.559587,1.55959 v 1.11408 h 16.933318 v -1.11408 c 0,-0.86404 -0.695644,-1.55959 -1.559691,-1.55959 z" />
                    <text
                        style={{fontWeight: "bold", fontSize: "10.2134px", fontFamily: "sans-serif", opacity: 1, fill: "#000000", fillOpacity: 1, strokeWidth: "0.53198",strokeLinecap:"round",strokeLinejoin: "round"}}
                        x="67"
                        y="124.91429"
                        id="text2871"><tspan
                        id="tspan2869"
                        style={{fontSize: "10.2134px", fill: "#000000", fillOpacity: 1, strokeWidth: "0.531982"}}
                        x="67"
                        y="124.91429">{new Date().getDate() < 10 ? "0"+new Date().getDate() : new Date().getDate()} </tspan></text>
                    </g>
                </svg>
                <h2>{new Date().getDate()} {MONTH[new Date().getMonth()]} </h2>
                </div>
                {shift ? <div className={style.landpage_shift_time}>
                    <div>
                        <h3>{shift.start} </h3>
                    </div>
                    <div>
                        <Image src={exit} alt="exit" className={style.shift_time_content_icon} />
                        <h3>{shift.end} </h3>
                    </div>
                    <div className={style.shift_time_content}>
                        <Image src={pause} alt="pause" className={style.shift_time_content_icon} />
                        <h3>{shift.pause} mins</h3>
                    </div>
                </div> : <h3>Vous etes libre</h3>}
            </div>
            <Holydays {...{holydays}} />
        </div>
    )
}

export default HomeCompany