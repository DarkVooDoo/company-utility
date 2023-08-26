"use server"

import { Profile } from "@/util/data"
import { revalidateTag } from "next/cache"
import {cookies} from "next/headers"

export const onModifyProfile = async(formData: FormData)=>{
    const token = cookies().get("auth-token")?.value
    const user = {firstname: formData.get("firstname"), lastname: formData.get("lastname"), adresse: formData.get("adresse"), postal: formData.get("postal")}
    if (token){
        const modifyUser = await fetch(`http://localhost:5000/api/user`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({...user})
        })
        if (modifyUser.status === 200){
            revalidateTag("profile")
            return await modifyUser.json() as Profile
        }
    }
    // modifyUser.status === 200 ? setNotification({message: "Modifié", isSuccess: true}) : setNotification({message: "Error", isSuccess: false})
}

export const onNewMember = async(formData: FormData)=>{
    const email = formData.get("email")
    const companyId = cookies().get("company-id")?.value
    const token = cookies().get("auth-token")
    if(token){
        const addMember = await fetch(`http://localhost:5000/api/member`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token.value]],
            body: JSON.stringify({email, companyId, role: "User"})
        })
        if (addMember.status === 200) {
            const newMember = await addMember.json() as {id: string, name: string, role: string}
            // setAllMembers(members=>([...members, {id: newMember.id, name: newMember.name, role: newMember.role}]))
            revalidateTag(`company`)
            return newMember
        }
    }
}

export const onDeleteMember = async(formData: FormData)=>{
    const token = cookies().get("auth-token")?.value
    const companyId = cookies().get("company-id")?.value
    const memberId = formData.get("delete")
    if (token){
        const deleteMember = await fetch(`http://localhost:5000/api/member`,{
            method: "DELETE",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({id: memberId, companyId})
        })
        if (deleteMember.status === 200) {
            // setAllMembers([...allMembers.filter(member=>member.id != id)])
            revalidateTag(`company`)
        }
    }
}