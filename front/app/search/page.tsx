
import { QuerySearch } from "@/util/data";
import style from "./style.module.css"

import Search from "@/component/Search"

interface Props{
    children: React.ReactNode
    searchParams?: { [key: string]: string | string[] | undefined };
}

const SearchLayout = async({searchParams}:Props)=>{
    const search = await QuerySearch(searchParams?.q?.toString()!) as {user_amount: number, company_amount: number, users: {id: string, name: string}[], companys: {id: string, name: string}[]}
    return (
        <main className={style.search}>
            <Search {...{...search}} />
        </main>
    )
}

export default SearchLayout