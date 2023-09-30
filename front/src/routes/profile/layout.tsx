import { Slot, component$, useSignal, $, type QwikMouseEvent } from "@builder.io/qwik"
import { DocumentHead, Link, routeLoader$} from "@builder.io/qwik-city"

import style from "./style.module.css"

const LINKS = [
    {
        path: "/profile",
        text: "Profile",
        index: 0
    },
    {
        path: "/profile/payroll",
        text: "Gain",
        index: 1
    },
    {
        path: "/profile/company",
        text: "Entreprise",
        index: 2
    }
]

export const useGetPathname = routeLoader$((req)=>{
    switch(req.pathname){
        case "/profile/":
            return 0
        case "/profile/payroll/":
            return 1
        case "/profile/company/":
            return 2
        default:
            return 3
    }
})

const ProfileLayout = component$(()=>{
    const tab = useGetPathname()
    const navigationRef = useSignal<HTMLDivElement>()
    const currentTab = useSignal(tab.value)

    const onChangeTab = $((e:QwikMouseEvent<HTMLAnchorElement, MouseEvent>, element: HTMLAnchorElement)=>{
        currentTab.value = parseInt(element.dataset.index || "0")
    })
    const links = LINKS.map((link)=>(
        <Link key={link.index} href={link.path} class={style.profile_navigation_link} data-index={link.index} onClick$={onChangeTab}>{link.text} </Link>
    ))
    return (
        <div class={style.profile} ref={navigationRef}>
            <div class={style.profile_navigation}>
                {links}
                <span class={style.profile_navigation_track}
                style={{
                    left: 100/links.length*currentTab.value+"%", 
                    borderRadius: currentTab.value === 0 ? "10px 0px 0px 10px" : currentTab.value + 1 === links.length ? "0px 10px 10px 0px" : "0px"
                }} />
            </div>
            <Slot />
        </div>
    )
})

export const head:DocumentHead ={
    title: "Profile"
}

export default ProfileLayout