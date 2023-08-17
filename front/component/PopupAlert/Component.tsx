"use client"
import { useEffect, useRef } from "react"
import style from "./style.module.css"

interface Props{
    message: string
    isSuccess: boolean
    onAnimationEnd: ()=> void
}

const PopupAlert:React.FC<Props> = ({message, isSuccess, onAnimationEnd})=>{
    const popupRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        popupRef.current?.addEventListener("animationend", (e)=>{
            e.stopImmediatePropagation()
            if (e.animationName === style.fade){
                onAnimationEnd()
            }
        })
    },[])
    return (
        <div ref={popupRef} className={style.popup}>
            <p>{message} </p>
            <span className={style.popup_state} style={{backgroundColor: isSuccess ? "green" : "red"}} />
        </div>
    )
}

export default PopupAlert