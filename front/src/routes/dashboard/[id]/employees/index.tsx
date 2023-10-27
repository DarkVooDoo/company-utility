import { component$, $, useStore } from "@builder.io/qwik"
import { DocumentHead, Form, routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city"
import type { Member } from "~/lib/types"
import { BACKEND_HOST } from "~/lib/util"

import style from "./style.module.css"
import CustomSelect from "~/components/CustomSelect/component"

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
}, zod$({
    email: z.string(),
    salary: z.number()
}))

export const useChangeMemberRole = routeAction$(async(form)=>{
    await fetch(`${BACKEND_HOST}:5000/api/member`,{
        method: "PATCH",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(form)
    })
})

const Employees = component$(()=>{
    const members = useGetEmployees()
    const signalMembers = useStore({member: members.value})
    const onNewMember = useAddMember()
    const renderRoles = $((role: string)=>(
        <div key={role}>{role} </div>
    ))
    const member = signalMembers.member.map(member=><UserRole key={member.id} {...{...member}} />)
    return (
        <main>
            <Form action={onNewMember} class={style.member_newEmployee}>
                <fieldset class={style.member_newEmployee_fieldset}>
                    <legend class={style.member_newEmployee_fieldset_legend}>Ajouter un employé</legend>
                    <div>
                        <label for="email">Email</label>
                        <input type="text" name="email" id="email" autoComplete="off" placeholder="Nouveau employé email" class={style.member_newInput_input} />
                    </div>
                    <div>
                        <p>Role</p>
                        <CustomSelect items={["Admin", "User"]} value="User" renderOption={renderRoles} width={5} height={2} />
                    </div>
                    <button type="submit" style={{display: "none"}}></button>
                
                </fieldset>
            </Form>
            <div class={style.member_container}>
                {member}
            </div>
        </main>
    )
})

const UserRole = component$<Member>(({id, name, role})=>{
    const member = useStore({id, role, name})
    const onChangeMemberRole = useChangeMemberRole()
    const onDeleteMember = useDeleteMember()

    const renderRoles = $(({role, memberId}:{role: string, memberId: string})=>(
        <div key={memberId} onClick$={async ()=>{
            await onChangeMemberRole.submit({id: memberId, role})            
            member.role = role
        }}>{role}</div>
    ))
    return (
        <div key={member.id} class={style.member}>
            <div class={style.member_name}>
                <p>Nom</p>
                <p class={style.member_name_text}>{member.name}</p>
            </div>
            <div class={style.member_role}>
                <p>Role</p>
                {member.role === "Boss" ? <p class={style.member_role_text}>{member.role} </p> : 
                <CustomSelect 
                    items={[{role: "Admin", memberId: member.id}, {role: "User", memberId: member.id}]}
                    value={member.role}
                    width={5}
                    renderOption={renderRoles}  />}
            </div>
            {member.role !== "Boss" && 
                <Form action={onDeleteMember} class={style.member_delete}>
                    <button name="remove" type="submit" value={member.id} class={style.member_deleteBtn}>
                        Supprimer
                    </button>
                </Form>}
        </div>
    )
})

export const head: DocumentHead = {
    title: "Employés"
}

export default Employees