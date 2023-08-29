
import { GetCompanys } from "@/util/data"
import MyCompanys from "@/component/MyCompanys/component"
import { onCreateCompany } from "@/app/actions"

import style from "@/app/profile/profile.module.css"

const Entreprise = async ()=>{
    const companys = await GetCompanys("Profile")
    return (
        <div>
            <form action={onCreateCompany}>
                <h2>Nouvelle Enreprise</h2>
                <div className={style.input}>
                    <input className={style.input_ele} required type="text" name="name" id="name" autoComplete="off"/>
                    <label className={style.input_label} htmlFor="name">Nom</label>
                </div>
                <div className={style.input}>
                    <input className={style.input_ele} required type="text" name="adresse" id="adresse" autoComplete="off" />
                    <label className={style.input_label} htmlFor="name">Adresse</label>
                </div>
                <div className={style.input}>
                    <input className={style.input_ele} required type="number" name="postal" id="postal" autoComplete="off" />
                    <label className={style.input_label} htmlFor="postal">Postal</label>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button type="submit" className={style.button}>Creer</button>
                </div>
            </form>
            {companys && <MyCompanys {...{companys, type: "Profile"}} />}
        </div>
    )
}

export default Entreprise