"use client"

import { useEffect, useRef, useState } from "react"
import style from "./style.module.css"

interface Props{
    sec: number
}

const Timer:React.FC<Props> = ({sec})=>{
    const hourRef = useRef<HTMLHeadingElement>(null)
    const hourNextRef = useRef<HTMLHeadingElement>(null)
    const [seconds, setSeconds] = useState(sec)

    useEffect(()=>{
        setInterval(()=>{
            setSeconds(seconds=>seconds+1)
        }, 1000)
    }, [])
    return (
        <div className={style.timer}>
            <div>
                <h2 ref={hourRef} className={style.timer_hour}>{Math.floor((seconds / (60 * 60)) )}</h2>
                <h2 ref={hourNextRef} className={style.timer_next}></h2>
            </div>
            <h2>:</h2>
            <div>
                <h2>{Math.floor((seconds / 60) )}</h2>
            </div>
            <h2>:</h2>
            <div>
                <h2>{seconds % 60}</h2>
            </div>
        </div>
    )
}

export default Timer