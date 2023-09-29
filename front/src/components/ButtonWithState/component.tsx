import { component$ } from "@builder.io/qwik"

import Loading from "~/media/loading.webp?jsx"

interface Props {
    type?: "submit" | "button"
    className?: string
    text: string
    state: boolean
}

const ButtonWithState = component$<Props>(({state, text, className, type = "button"})=>{
    return (
        <button class={className} type="submit" disabled={state ? true : false}>Modifier {state && <Loading alt="loading" class={"btn_loading"} />}</button>
    )
})

export default ButtonWithState