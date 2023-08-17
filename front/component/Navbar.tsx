"use client"
import style from "@/style/Navbar.module.css"
import { useContext, useEffect, useRef } from "react"
import { userContext } from "./UserContext"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

import User from "@/public/user.webp"
import { closeDialogOnBackdropClick } from "@/util/lib"

const Navbar = ()=>{
    const router = useRouter()
    const sideBarRef = useRef<HTMLDialogElement>(null)
    const [user, onUserChange] = useContext(userContext)

    const onCloseSideBar = ()=>{
        sideBarRef.current?.close()
    }

    const onOpenSideBar = ()=>{
        sideBarRef.current?.showModal()
    }

    useEffect(()=>{
        const dialog = sideBarRef.current
        if (dialog) closeDialogOnBackdropClick(dialog)
    },[])

    const onLogOff = ()=>{
        onUserChange({user_id: "", user_lastname: ""})
        document.cookie = "id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "lastname=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "auth-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push("/")
        onCloseSideBar()
    }
    return (
        <nav className={style.navbar}>
            <Link href="/">Home</Link>
            <div className={style.navbar_navigation}>
                {user.user_id !== "" ? 
                    <button className={style.navbar_logBtn} onClick={onOpenSideBar}>
                        <Image src={User} alt="user" className={style.navbar_logBtn_icon} />
                    </button> : 
                    <Link href="/sign">Connexion</Link>
                }
            </div>
            <dialog ref={sideBarRef} className={style.navbar_logBtn_content}>
                <div>
                    <Image src={User} alt="user photo" />
                    <h2>{user.user_lastname} </h2>
                </div>
                <button type="button" onClick={onLogOff}>Log Off</button>
                <Link href="/shift" className={style.navbar_logBtn_content_link} onClick={onCloseSideBar}>Planning</Link>
                <Link href={`/profile`} className={style.navbar_logBtn_content_link} onClick={onCloseSideBar}>Profile</Link>
            </dialog>
        </nav>
    )
}

export default Navbar