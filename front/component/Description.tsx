"use client"
import { useEffect, useRef } from "react"

const Description = ()=>{
    const divRef = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        divRef.current!.innerHTML = `<div><h1>Hello</h1></div>`
    }, [])
    return(
        <div ref={divRef}>

        </div>
    )
}

export default Description