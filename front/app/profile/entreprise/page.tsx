
import NewCompany from "@/component/NewCompany"
import { GetCompanys } from "@/util/data"
import MyCompanys from "@/component/MyCompanys/component"

const Entreprise = async ()=>{
    const companys = await GetCompanys("Profile")
    return (
        <div>
            <NewCompany />
            {companys && <MyCompanys {...{companys, type: "Profile"}} />}
        </div>
    )
}

export default Entreprise