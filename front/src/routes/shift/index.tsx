import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

const Shift = component$(()=>{
    return (
        <p>Select company</p>
    )
})

export const head:DocumentHead = {
    title: "Planning"
}

export default Shift