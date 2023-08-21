"use client"
import { useContext, useEffect, useRef, useState } from "react"
import { userContext } from "./UserContext"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

import User from "@/public/user.webp"
import LeftArrow from "@/public/left-arrow.webp"
import bell from "@/public/bell.svg"

import style from "@/style/Navbar.module.css"
import { closeDialogOnBackdropClick } from "@/util/lib"

const Navbar:React.FC<{notif: {id: string, message: string, date: string}[] | []}> = ({notif})=>{
    const router = useRouter()
    const sideBarRef = useRef<HTMLDialogElement>(null)
    const notifRef = useRef<HTMLDivElement>(null)
    const [user, onUserChange] = useContext(userContext)
    const [showNotif, setShowNotif] = useState(false)
    const onCloseSideBar = ()=>{
        sideBarRef.current?.close()
    }

    const onOpenSideBar = ()=>{
        sideBarRef.current?.showModal()
    }

    const onCloseNotif = ()=>{
        notifRef.current?.animate({
            left: ["0", "-100vw"]
        }, {duration: 100, fill: "forwards"}).addEventListener("finish", ()=>{
            setShowNotif(false)
        })
    }

    const onDeleteNotif = async (notifId: string)=>{
        const deleteNotif = await fetch(`http://localhost:5000/api/notif`, {
            method: "DELETE",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({id: notifId})
        })
        if (deleteNotif.status === 200) onCloseNotif()
    }

    useEffect(()=>{
        const dialog = sideBarRef.current
        if (dialog) closeDialogOnBackdropClick(dialog)
         
    },[])

    const onLogOff = ()=>{
        onUserChange({user_id: "", user_name: ""})
        document.cookie = "id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "lastname=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "auth-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push("/")
        onCloseSideBar()
    }

    const notifs = notif.map(notif=>(
        <div className={style.navbar_notifPopup_notif} key={notif.id}>
            <button type="button" className={style.navbar_notifPopup_notif_deleteBtn} onClick={()=>onDeleteNotif(notif.id)}>X</button>
            <p className={style.navbar_notifPopup_notif_date}>{notif.date} </p>
            <p>{notif.message} </p>
        </div>
    ))

    return (
        <nav className={style.navbar}>
            <Link href="/">Home</Link>
            <div className={style.navbar_navigation}>
                {user.user_id !== "" ? 
                    <>
                        <button onClick={()=>setShowNotif(true)}><Image src={bell} alt="notification" className={style.navbar_navigation_bellIcon} /> </button>
                        <button className={style.navbar_logBtn} onClick={onOpenSideBar}>
                            <Image src={User} alt="user" className={style.navbar_logBtn_icon} />
                        </button>
                    </> : 
                    <Link href="/sign">Connexion</Link>
                }
            </div>
            <dialog ref={sideBarRef} className={style.navbar_sideBar}>
                <div className={style.navbar_sideBar_user}>
                    <Image src={User} alt="user photo" className={style.navbar_sideBar_user_photo} />
                    <h2 className={style.navbar_sideBar_user_name}>{user.user_name} </h2>
                </div>
                <Link href="/shift" className={style.navbar_sideBar_link} onClick={onCloseSideBar}>Planning</Link>
                <Link href={`/profile`} className={style.navbar_sideBar_link} onClick={onCloseSideBar}>Profile</Link>
                <button type="button" onClick={onLogOff} className={style.navbar_sideBar_logoffBtn} >Log Off</button>
            </dialog>
            {showNotif && <div ref={notifRef} className={style.navbar_notifPopup}>
                <div className={style.navbar_notifPopup_header}>
                    <button type="button" onClick={onCloseNotif}><Image src={LeftArrow} alt="close" className={style.navbar_notifPopup_closeBtn} /></button>
                    <h1>Notification</h1>
                </div>
                {notifs.length > 0 ? notifs : <h1>Il y a pas de notification</h1>}
            </div>}
        </nav>
    )
}

export default Navbar