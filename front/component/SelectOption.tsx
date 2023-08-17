"use client"

import style from "@/style/SelectOption.module.css"
import { useEffect, useRef } from "react"

interface SelectOptionProps<T> {
    value: string,
    items: T[],
    render: (item: T)=> React.ReactNode,
    className?: string
}

const SelectOption = <T extends unknown>({className, value, items, render}: SelectOptionProps<T>)=>{
    const optionsRef = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        optionsRef.current?.childNodes.forEach(node=>{
            node.addEventListener("click", ()=>{
                optionsRef.current?.classList.toggle(style.hidden)
            })
        })
    },[])

    return (
        <div className={`${style.header_box} ${className}`}>
            <div className={style.header_box_current} onClick={()=>{
                optionsRef.current?.classList.toggle(style.hidden)
            }}>{value} </div>
            <div ref={optionsRef} className={`${style.header_box_list} ${style.hidden}`}>
                {items.map(item=>(render(item)))}
            </div> 
        </div>
    )
}

export default SelectOption
