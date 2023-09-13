import { onDeleteMember, onNewMember } from "@/app/actions"
import { GetMembers } from "@/util/data"

import style from "./style.module.css"
import ChangeUserRole from "@/component/ChangeUserRole"

const Employees = async ()=>{
    const members = await GetMembers()

    const member = members.map(member=>(
        <div key={member.id} className={style.member}>
            <div className={style.member_name}>
                <p>Nom</p>
                <p className={style.member_name_text}>{member.name} narayanaiken</p>
            </div>
            <div className={style.member_role}>
                <p>Role</p>
                {member.role === "Boss" ? <p className={style.member_role_text}>{member.role} </p> : <ChangeUserRole {...{currentRole: member.role, roles: [{role: "Admin", memberId: member.id}, {role: "User", memberId: member.id}]}} />}
            </div>
            {member.role !== "Boss" && 
                <form action={onDeleteMember} className={style.member_delete}>
                    <button name="delete" type="submit" value={member.id} className={style.member_deleteBtn}>
                        Supprimer
                    </button>
                </form>}
        </div>
    ))
    return (
        <main>
            <h1 className={style.member_header}>Employés</h1>

            <form action={onNewMember} className={style.member_newEmail}>
                <input type="text" name="email" id="email" autoComplete="off" placeholder="Nouveau employé email" className={style.member_newInput_input} />
                <input type="number" name="salary" id="salary" step={".01"} className={style.member_newInput_input} placeholder="Salaire brut" />
                <button type="submit" style={{display: "none"}}></button>
            </form>
            <div className={style.member_container}>
                {member}
            </div>
        </main>
    )
}

export default Employees