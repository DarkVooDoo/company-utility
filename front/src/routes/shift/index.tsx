import { component$ } from "@builder.io/qwik"
import { DocumentHead, RequestHandler } from "@builder.io/qwik-city"

export const onRequest: RequestHandler = ({redirect, cookie})=>{
    const company = cookie.get("company-id")?.value
    if(company){
        throw redirect(307, `/shift/${company}`)
    }
}

const Shift = component$(()=>{
    return (
        <p>Select company</p>
    )
})

export const head:DocumentHead = {
    title: "Planning"
}

export default Shift