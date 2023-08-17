import UserProfile from "@/component/UserProfile"
import style from "./profile.module.css"
import { getUserProfile } from "@/util/data"

const Profile = async ()=>{
    const profile = await getUserProfile()
    return (
        <div>
            <h3 className={style.profile_header}>Personal info </h3>
            <UserProfile {...{...profile}} />
        </div>
    )
}

export default Profile