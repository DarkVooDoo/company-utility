
import {onModifyProfile} from "@/app/actions"

import style from "./profile.module.css"
import { getUserProfile } from "@/util/data"

const Profile = async ()=>{
    const profile = await getUserProfile()
    return (
        <div>
            <h3 className={style.profile_header}>Personal info </h3>
            <form action={onModifyProfile}>
                <div className={style.profile_input}>
                    <label className={style.profile_input_label} htmlFor="firstname">Prenom</label>
                    <input className={style.profile_input_ele} required type="text" name="firstname" id="firstname" autoComplete="off" defaultValue={profile.firstname} />
                </div>
                <div className={style.profile_input}>
                    <label className={style.profile_input_label} htmlFor="lastname">Nom</label>
                    <input className={style.profile_input_ele} required type="text" name="lastname" id="lastname" autoComplete="off" defaultValue={profile.lastname} />
                </div>
                <div className={style.profile_input}>
                    <label className={style.profile_input_label} htmlFor="adresse">Adresse</label>
                    <input className={style.profile_input_ele} required type="text" name="adresse" id="adresse" autoComplete="off" defaultValue={profile.adresse} />
                </div>
                <div className={style.profile_input}>
                    <label className={style.profile_input_label} htmlFor="postal">Postal</label>
                    <input className={style.profile_input_ele} required type="number" name="postal" id="postal" autoComplete="off" defaultValue={profile.postal}  />
                </div>
                <button className={style.button} type="submit">Modifier</button>
                {/* {notification && <PopupAlert {...{...notification, onAnimationEnd: ()=>{
                    setNotification(undefined)
                }}} />} */}
            </form>
        </div>
    )
}

export default Profile