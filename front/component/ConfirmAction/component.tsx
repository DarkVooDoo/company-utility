"use client"

import { useEffect, useRef } from "react"

import style from "./style.module.css"

interface Props{
    displayText: string,
    name: string,
    isOpen: boolean
    value: any,
    action: (formData: FormData)=> void
}

const ConfirmAction:React.FC<Props> = ({displayText, action, name, value, isOpen})=>{
    const dialogRef = useRef<HTMLDialogElement>(null)
    useEffect(()=>{
        if (isOpen) dialogRef.current?.showModal()
    },[isOpen])
    return (
        <dialog ref={dialogRef} className={style.dialog}>
            <form action={action} className={style.dialog_form}>
                <p>{displayText} </p>
                <div className={style.dialog_action}>
                    <button type="submit" name={name} value={value} className={style.dialog_confirmBtn}>Confirmer </button>
                    <button type="button" className={style.dialog_cancelBtn} onClick={()=>dialogRef.current?.close()}>Cancel</button>
                </div>
            </form>
        </dialog>
    )
}

export default ConfirmAction