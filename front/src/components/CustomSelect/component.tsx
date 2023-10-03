import {CSSProperties, JSXNode, component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik"

import style from "./style.module.css"

interface Props<T>{
    value: string
    clasStyle?: string
    position?: "top" | "right" | "bottom" | "left"
    height?: number
    width?: number
    items: T[]
    renderOption: (item: T)=>JSXNode
} 

const CustomSelect = component$(<T extends {}>({value, clasStyle, items, height = 2.5, width = 7, position = "bottom", renderOption}:Props<T>)=>{
    const isVisible = useSignal(false)

    useVisibleTask$(({track})=>{
        track(()=>value)
        isVisible.value = false
    })

    const optionPosition = ():CSSProperties=>{
        switch(position){
            case "left":
                return {left: "0"}
            case "bottom":
                return {top: (height+.2)+"rem", left: 0}
            case "right":
                return {}
            default:
                return {bottom: (height+.2)+"rem", left: 0}
        }
    }
    return (
        <div class={[style.select, clasStyle]} style={{height: height+"rem", width: width+"rem"}}>
            <div class={style.select_display} onClick$={()=>isVisible.value = !isVisible.value} >{value} <span class={[style.arrow, isVisible.value ? style.downArrow : style.upArrow]}></span> </div>
            {isVisible.value && <div class={[style.select_option]} style={optionPosition()}>
                {items.map(item=>(renderOption(item)))}
            </div>}
        </div>
    )
})

export default CustomSelect