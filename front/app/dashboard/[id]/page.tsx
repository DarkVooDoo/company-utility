import Actions from "@/component/Members/Component"
import { GetMyCompany } from "@/util/data"

import style from "./style.module.css"

interface Props{
    params:{id: string}
}

const Test = [
    {
        user_name: "Justin TV",
        shift_id: "2323",
        shift_start: "10:00",
        shift_end: "22:00",
        shift_pause: 30,
    },
    {
        user_name: "John Bravo",
        shift_id: "233",
        shift_start: "10:00",
        shift_end: "22:00",
        shift_pause: 30,
    },
    {
        user_name: "John Doe",
        shift_id: "232",
        shift_start: "10:00",
        shift_end: "22:00",
        shift_pause: 30,
    }
]

const Dashboard = async ({params:{id}}:Props)=>{
    const company = await GetMyCompany(id) as  {name: string, adresse: string, members: {id: string, name: string, role: string}[]}
    const shift = Test.map(shift=>(
        <div>
            <h1>{shift.user_name} </h1>
            <p>{shift.shift_start} </p>
            <p>{shift.shift_end} </p>
            <p>{shift.shift_pause} </p>
        </div>
    ))
    return (
        <main>
            <h1>{company.name}</h1>
            <p>Adresse {company.adresse}</p>
            <h1>Planning Aujourd'hui</h1>
            {shift}
            <div>
                <h1>Congés</h1>
                <h1>John Doe</h1>
                <p>demande de congé payé du 22 Juillet au 30 Juillet</p>
                <div>
                    <button type="button">Refusé</button>
                    <button type="button">Accepté</button>
                </div>
            </div>
            <Actions {...{members: company.members, companyId: id}} />
        </main>
    )
}

export default Dashboard