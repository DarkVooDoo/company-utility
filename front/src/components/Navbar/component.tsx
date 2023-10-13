import { component$, useContext, useSignal, $ } from "@builder.io/qwik"

import style from "./style.module.css"
import { CdnPrefix, userContext } from "~/lib/util"
import { Link, useNavigate } from "@builder.io/qwik-city"

import Logo from "~/media/logo.webp?jsx"
import Bell from "~/media/bell.svg?jsx"
import User from "~/media/user.svg?jsx"
import LeftArrow from "~/media/left-arrow.webp?jsx"
import Signout from "~/media/signout.webp?jsx"

interface Props{
    companys: {id: string, name: string, adresse: string, postal: number}[]
    notif: {id: string, message: string, date: string}[] | []
}

const Navbar = component$<Props>(({notif, companys})=>{
    const nav = useNavigate()
    const [user, onUserChange] = useContext(userContext)

    const myNotif = useSignal(notif)
    const myCompanys = useSignal(companys)
    const showNotif = useSignal(false)
    const isMenuOpen = useSignal(false)
    const isEntrepriseDropdownOpen = useSignal(false)
    
    const onOpenSideBar = $(()=>{
        isMenuOpen.value = !isMenuOpen.value
    })

    const onCloseSideBar = $(()=>{
        isMenuOpen.value = false
    })
    
    const onOpenNotif = $(()=>{
        if (notif) showNotif.value = true
    })

    const onCloseNotif = $(()=>{
        showNotif.value = false
    })

    const onDeleteNotif = $(async (id: string)=>{
        const deleteNotif = await fetch(`http://localhost:5000/api/notif`, {
            method: "DELETE",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({id})
        })
        if(deleteNotif.status === 200) {
            const newNotif = myNotif.value.filter(notif=>notif.id !== id)
            myNotif.value = newNotif
        }
    })

    const onLogOff = $(()=>{
        onUserChange() 
        document.cookie = "id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "user_name=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "auth-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "company-id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        isMenuOpen.value = false
        nav("/sign")
    })
    const notifs = myNotif.value.map(notification=>(
        <div class={style.navbar_notifPopup_notif} key={notification.id}>
            <button type="button" aria-label="delete notif" class={style.navbar_notifPopup_notif_deleteBtn} onClick$={()=>onDeleteNotif(notification.id)}>X</button>
            <p class={style.navbar_notifPopup_notif_date}>{notification.date} </p>
            <p>{notification.message} </p>
        </div>
    ))

    const company = myCompanys.value.map(comp=>(
        <Link key={comp.id} href={`/dashboard/${comp.id}`} class={style.navbar_sideBar_companys_btn_more_row} onClick$={onCloseSideBar}>- {comp.name}</Link>
    ))
    return (
        <nav class={style.navbar}>
            <Link href={user.value.user_id ? "/home" : "/"}><Logo class={style.navbar_logo} alt="home"/></Link>
            <div class={`${style.navbar_search}`}>
                {/* <div class={`${style.navbar_search_box}`}>
                    <input type="text" ref={inputRef}
                    class={`${style.navbar_search_bar} ${onSearch ? style.bar_fullwidth : ""}`} name="search" id="search" 
                    placeholder="Recherche un annonce" required autoComplete="off"
                    onChange={({currentTarget:{value}})=>setSearchText(value)}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter") router.push(`/search?q=${searchText}`)
                    }}
                    onBlur={(e)=>{e.currentTarget.classList.remove(style.bar_fullwidth)}} />
                    {<button type="button" class={style.navbar_search_icon} onClick={()=>{
                        setOnSearch(prev=>!prev)
                        !onSearch ? inputRef.current?.focus() : inputRef.current?.blur()
                    }}><Image src={search} alt="search" class={style.navbar_search_icon_i} /></button>}
                </div> */}
            </div>
            <div class={style.navbar_navigation}>
                {user.value.user_id !== "" ? 
                    <>
                        <button aria-label="ouvrir notification" onClick$={onOpenNotif}><Bell alt="notification" class={style.navbar_navigation_bellIcon} /> </button>
                        <button type="button" aria-label="ouvrir menu" class={style.navbar_logBtn} onClick$={onOpenSideBar} >
                            {user.value.user_photo === "" ? <User alt="user" class={style.navbar_logBtn_icon} /> : <img src={CdnPrefix+"profile/"+user.value.user_photo} width={64} height={64} alt="profile" class={style.navbar_logBtn_icon} /> }
                        </button>
                    </> : 
                    <Link href="/sign" class={style.navbar_navigation_sign}>Connexion</Link>
                }
            </div>
            <div class={[style.navbar_sideBar, isMenuOpen.value ? style.navbar_sideBar_open : style.navbar_sideBar_close]}>
                <div class={style.navbar_sideBar_user}>
                    <div class={style.navbar_sideBar_user_info}>
                        {user.value.user_photo === "" ? <User alt="user" class={style.navbar_sideBar_user_photo} /> : <img src={CdnPrefix+"profile/"+user.value.user_photo} width={64} height={64} alt="profile" class={style.navbar_sideBar_user_photo} /> }
                        <h2 class={style.navbar_sideBar_user_name}>{user.value.user_name} </h2>
                    </div>
                    <button type="button" aria-label="Log off" class={style.navbar_sideBar_user_logoffBtn} onClick$={onLogOff}>
                        <Signout class={style.navbar_sideBar_logoffBtn_icon} />
                    </button>
                </div>
                <div>

                    <Link href="/shift" class={style.navbar_sideBar_link} onClick$={onCloseSideBar}>Planning</Link>
                </div>
                <Link href="/profile" class={style.navbar_sideBar_link} onClick$={onCloseSideBar}>Profile</Link>
                <div class={style.navbar_sideBar_companys}>
                    <button class={style.navbar_sideBar_companys_btn} onClick$={(e)=>{
                        e.stopPropagation()
                        isEntrepriseDropdownOpen.value = !isEntrepriseDropdownOpen.value
                    }}> 
                        <p>Mes Entreprises</p>
                        <span class={style.navbar_sideBar_companys_btn_arrow} style={isEntrepriseDropdownOpen.value ? {transform: "rotate(45deg)"} : {}} />
                    </button>
                    <div class={`${style.navbar_sideBar_companys_btn_more}`} style={isEntrepriseDropdownOpen.value ? {height: company.length * 2.5+"rem", opacity: 1}: {height: 0, opacity: 0}}>
                        {company}
                    </div>
                </div>
                {/* <Link href={`/message`} class={style.navbar_sideBar_link} onClick$={onCloseSideBar}>Message</Link> */}
                {/* <button type="button" aria-label="Log off" class={style.navbar_sideBar_logoffBtn} onClick$={onLogOff}>
                    <Signout class={style.navbar_sideBar_logoffBtn_icon} />
                    <p>Log Off</p>
                </button> */}
            </div>
            <div class={[style.navbar_notifPopup, showNotif.value ? style.open : style.close]}>
                <div class={style.navbar_notifPopup_header}>
                    <button type="button" aria-label="fermer les notif" onClick$={onCloseNotif}><LeftArrow alt="close" class={style.navbar_notifPopup_closeBtn} /></button>
                    <h1>Notification</h1>
                </div>
                {myNotif.value.length > 0 ? <>
                    {notifs}
                </> : <h1>Il y a pas de notification</h1>}
            </div>
        </nav>
    )
})

export default Navbar