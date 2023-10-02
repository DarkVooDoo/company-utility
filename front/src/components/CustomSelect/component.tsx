import {CSSProperties, JSXNode, component$, useSignal } from "@builder.io/qwik"

import style from "./style.module.css"

interface Props<T>{
    value: string
    position?: "top" | "right" | "bottom" | "left"
    height?: number
    width?: number
    items: T[]
    renderOption: (item: T)=>JSXNode
}

const CustomSelect = component$(<T extends {}>({value, items, height = 2, width = 7, position = "bottom", renderOption}:Props<T>)=>{
    const isVisible = useSignal(false)

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
        <div class={style.select} style={{height: height+"rem", width: width+"rem"}}>
            <input type="text" name="name" id="name" readOnly class={style.select_display} value={value} onClick$={()=>isVisible.value = !isVisible.value} />
            {isVisible.value && <div class={[style.select_option]} style={optionPosition()}>
                {items.map(item=>(renderOption(item)))}
            </div>}
        </div>
    )
})

export default CustomSelect