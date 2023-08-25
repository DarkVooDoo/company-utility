import { GetCompanys } from "@/util/data"
import style from "./shift.module.css"
import Shift from "@/component/Shift/component"

const ShiftLayout = async ()=>{
    const allCompany = await GetCompanys("Shift")
    return (
        <main className={style.shift}>
            <Shift {...{companys: allCompany}} />
        </main>
    )
}

export default ShiftLayout