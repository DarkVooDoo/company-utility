import { component$ } from "@builder.io/qwik"

import Loading from "~/media/loading.webp?jsx"

interface Props {
    type?: "submit" | "button"
    clasStyle?: string
    text: string
    state: boolean
}

const ButtonWithState = component$<Props>(({state, text, clasStyle, type = "button"})=>{
    return (
        <button class={clasStyle} type={type} disabled={state ? true : false}>{text} {state && <Loading alt="loading" class={"btn_loading"} />}</button>
    )
})

export default ButtonWithState