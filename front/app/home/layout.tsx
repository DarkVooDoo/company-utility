import MyCompanys from "@/component/MyCompanys/component"
import { GetCompanys } from "@/util/data"

const HomeLayout:React.FC<{children: React.ReactNode}> = async ({children})=>{
    const companys = await GetCompanys("User")
    return (
        <main>
            <MyCompanys {...{type: "User", companys}} />
            {children}
        </main>
    )
}

export default HomeLayout