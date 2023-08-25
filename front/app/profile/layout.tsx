import Image from "next/image"
import Link from "next/link"

import user from "@/public/user.svg"
import trash from "@/public/trash.svg"

import style from "./profile.module.css"
import { getUserProfile } from "@/util/data"

import { Suspense } from "react"
interface Props{
    children: React.ReactNode
}

const ProfileLayout:React.FC<Props> = async ({children})=>{
    const profile = await getUserProfile()
    return (
        <main className={style.profile}>
            <div className={style.profile_name}>
                <Image src={"https://robohash.org/avatar"} alt="Profile" width={300} height={300} className={style.profile_name_photo} />
                <h1>{profile.firstname} {profile.lastname}</h1>
                <p>Inscrit depuis {profile.joined} </p>
            </div>
            <div className={style.profile_navigation}>
                <Link href={`/profile`} className={style.profile_navigation_link}>
                    <Image src={user} alt="Profile" className={style.profile_navigation_link_icon} />
                    <p className={style.profile_navigation_link_text}>Profile</p>
                </Link>
                <Link href={`/profile/entreprise`} className={style.profile_navigation_link}>
                    <Image src={trash} alt="Pro" className={style.profile_navigation_link_icon} />
                    <p className={style.profile_navigation_link_text}>Pro</p>
                </Link>
                <Link href="#" className={style.profile_navigation_link}>
                    <Image src={trash} alt="Notification" className={style.profile_navigation_link_icon} />
                    <p className={style.profile_navigation_link_text}>Fiches</p>
                </Link>
            </div>
            <Suspense fallback={<p>Loading</p>}>
                {children}
            </Suspense>
        </main>
    )
}

export default ProfileLayout