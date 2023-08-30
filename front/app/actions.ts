"use server"

import { Profile } from "@/util/data"
import { revalidateTag } from "next/cache"
import {cookies} from "next/headers"
import { redirect } from "next/navigation"

export const onSignUser = async(formData: FormData)=>{
    const email = formData.get("email")
    const password = formData.get("password")
    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const confirmation = formData.get("confirmation")
    if (confirmation && confirmation === password){
        const createUser = await fetch(`http://localhost:5000/api/user`, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({email: email, password: password, firstname: firstname, lastname: lastname})
        })
    }else{
        const signUser = await fetch(`http://localhost:5000/api/auth`, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({email: email, password: password})
        })
        if(signUser.status === 200){
            const userCredential = await signUser.json()
            cookies().set("auth-token", userCredential.user_token, {maxAge: 60*60*24*3})
            cookies().set("user_name", userCredential.user_name, {maxAge: 60*60*24*3})
            cookies().set("id", userCredential.user_id, {maxAge: 60*60*24*3})
            revalidateTag("home")
            return {user_id: userCredential.user_id, user_name: userCredential.user_name}
        }
    }
}

export const onCreateCompany = async (formData: FormData)=>{
    const token = cookies().get("auth-token")?.value
    const info = {name: formData.get("name"), adresse: formData.get("adresse"), postal: parseInt(formData.get("postal")!!.toString())}
    if (token){
        const createCompany = await fetch(`http://localhost:5000/api/pro`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({...info})
        })
        if (createCompany.status === 200){
            revalidateTag("getMyCompanys")
        }
    }
}

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

export const onRequestHolyday = async(holydayType: string | undefined, dates: string[])=>{
    const token = cookies().get("auth-token")?.value
    const companyId = cookies().get("company-id")?.value
    if(token && companyId && holydayType){
        const sendHolydayRequest = await fetch(`http://localhost:5000/api/holyday`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({from: dates[0], to: dates[1], companyId: companyId, type: holydayType})
        })
        if (sendHolydayRequest.status === 200){
            revalidateTag("holyday")
        }

    }
}

export const onDeleteHolyday = async(formData: FormData)=>{
    const reject = await fetch(`http://localhost:5000/api/holyday`, {
        method: "DELETE",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({id: formData.get("id")})
    })
    if (reject.status === 200){
        revalidateTag("holyday")
    }
}

export const onRejectHolyday = async(formData: FormData)=>{
    const reject = await fetch(`http://localhost:5000/api/holyday`, {
        method: "PUT",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({id: formData.get("id"), type: "reject"})
    })
    if (reject.status === 200){
        revalidateTag("company")
    }
}

export const onAcceptHolyday = async(formData: FormData)=>{
    const accept = await fetch(`http://localhost:5000/api/holyday`, {
        method: "PUT",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({id: formData.get("id"), type: "accept"})
    })
    if (accept.status === 200){
        revalidateTag("company")
    }
}