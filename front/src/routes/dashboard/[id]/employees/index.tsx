import { component$ } from "@builder.io/qwik"
import { Form, routeAction$, routeLoader$ } from "@builder.io/qwik-city"
import type { Member } from "~/lib/types"
import { BACKEND_HOST } from "~/lib/util"

import style from "./style.module.css"

export const useGetEmployees = routeLoader$(async (req)=>{
    const token = req.cookie.get("auth-token")?.value
    const companyId = req.params.id
    if (!token) return []
    const fetchMember = await fetch(`${BACKEND_HOST}:5000/api/member?companyId=${companyId}`,{
        headers: [["Authorization", token]]
    })
    return await fetchMember.json() as Member[]
})

export const useDeleteMember = routeAction$(async(form, req)=>{
    const token = req.cookie.get("auth-token")?.value
    const companyId = req.cookie.get("company-id")?.value
    const { remove } = form
    if (token){
        await fetch(`${BACKEND_HOST}:5000/api/member`,{
            method: "DELETE",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({id: remove, companyId})
        })
    }
})

export const useAddMember = routeAction$(async(form, req)=>{
    const {email, salary} = form
    const companyId = req.cookie.get("company-id")?.value
    const token = req.cookie.get("auth-token")
    if(token){
        await fetch(`${BACKEND_HOST}:5000/api/member`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token.value]],
            body: JSON.stringify({email, companyId, role: "User", worth: salary})
        })
    }
})

export const useChangeMemberRole = routeAction$(async(form)=>{
    await fetch(`${BACKEND_HOST}:5000/api/member`,{
        method: "PATCH",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(form)
    })
})

const Employees = component$(()=>{
    const members = useGetEmployees()
    const onDeleteMember = useDeleteMember()
    const onNewMember = useAddMember()
    const onChangeMemberRole = useChangeMemberRole()
    const member = members.value.map(member=>(
        <div key={member.id} class={style.member}>
            <div class={style.member_name}>
                <p>Nom</p>
                <p class={style.member_name_text}>{member.name}</p>
            </div>
            <div class={style.member_role}>
                <p>Role</p>
                {/* {member.role === "Boss" ? <p class={style.member_role_text}>{member.role} </p> : 
                <ChangeUserRole {...{currentRole: member.role, roles: [{role: "Admin", memberId: member.id}, {role: "User", memberId: member.id}]}} />} */}
                {member.role === "Boss" ? <p class={style.member_role_text}>{member.role} </p> : 
                <select name="role" class={style.member_role_select} onChange$={async(role)=>{
                    await onChangeMemberRole.submit(JSON.parse(role.target.value))
                }}>
                    {[{role: "Admin", memberId: member.id}, {role: "User", memberId: member.id}].map(memberRole=>(
                        <option key={memberRole.role} selected={member.role === memberRole.role ? true : false} class={style.member_role_select_opt}
                        value={JSON.stringify({id: memberRole.memberId, role: memberRole.role})}>{memberRole.role}</option>
                    ))}
                </select>}
            </div>
            {member.role !== "Boss" && 
                <Form action={onDeleteMember} class={style.member_delete}>
                    <button name="remove" type="submit" value={member.id} class={style.member_deleteBtn}>
                        Supprimer
                    </button>
                </Form>}
        </div>
    ))
    return (
        <main>
            <h1 class={style.member_header}>Employés</h1>

            <Form action={onNewMember} class={style.member_newEmail}>
                <input type="text" name="email" id="email" autoComplete="off" placeholder="Nouveau employé email" class={style.member_newInput_input} />
                <input type="number" name="salary" id="salary" step={".01"} class={style.member_newInput_input} placeholder="Salaire horaire brut" />
                <button type="submit" style={{display: "none"}}></button>
            </Form>
            <div class={style.member_container}>
                {member}
            </div>
        </main>
    )
})

export default Employees