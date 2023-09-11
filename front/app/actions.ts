"use server"

import cryto from "crypto"
import { Profile } from "@/util/data"
import { BACKEND_HOST } from "@/util/lib"
import { revalidateTag } from "next/cache"
import {cookies} from "next/headers"
import { encode } from "punycode"
import { CurrentShift, Payroll } from "@/util/type"

export const onSignUser = async(formData: FormData)=>{
    const email = formData.get("email")
    const password = formData.get("password")
    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const confirmation = formData.get("confirmation")
    if (confirmation && confirmation === password){
        const createUser = await fetch(`${BACKEND_HOST}:5000/api/user`, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({email: email, password: password, firstname: firstname, lastname: lastname})
        })
    }else{
        const signUser = await fetch(`${BACKEND_HOST}:5000/api/auth`, {
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
        const createCompany = await fetch(`${BACKEND_HOST}:5000/api/pro`,{
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
        const modifyUser = await fetch(`${BACKEND_HOST}:5000/api/user`,{
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
    const salary = formData.get("salary")
    const companyId = cookies().get("company-id")?.value
    const token = cookies().get("auth-token")
    if(token){
        const addMember = await fetch(`${BACKEND_HOST}:5000/api/member`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token.value]],
            body: JSON.stringify({email, companyId, role: "User", worth: salary})
        })
        if (addMember.status === 200) revalidateTag(`member`)
    }
}

export const onChangeMemberRole = async(formData: FormData)=>{
    const role = JSON.parse(formData.get("newRole")?.toString() || "") as {id: string, role: string}
    const changeRole = await fetch(`${BACKEND_HOST}:5000/api/member`,{
        method: "PATCH",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify(role)
    })
    if (changeRole.status === 200) revalidateTag("member")
}

export const onDeleteMember = async(formData: FormData)=>{
    const token = cookies().get("auth-token")?.value
    const companyId = cookies().get("company-id")?.value
    const memberId = formData.get("delete")
    if (token){
        const deleteMember = await fetch(`${BACKEND_HOST}:5000/api/member`,{
            method: "DELETE",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({id: memberId, companyId})
        })
        if (deleteMember.status === 200) {
            // setAllMembers([...allMembers.filter(member=>member.id != id)])
            revalidateTag(`member`)
        }
    }
}

export const onRequestHolyday = async(holydayType: string | undefined, dates: string[])=>{
    const token = cookies().get("auth-token")?.value
    const companyId = cookies().get("company-id")?.value
    if(token && companyId && holydayType){
        const sendHolydayRequest = await fetch(`${BACKEND_HOST}:5000/api/holyday`,{
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
    const reject = await fetch(`${BACKEND_HOST}:5000/api/holyday`, {
        method: "DELETE",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({id: formData.get("id")})
    })
    if (reject.status === 200){
        revalidateTag("holyday")
    }
}

export const onRejectHolyday = async(formData: FormData, userId: string)=>{
    const reject = await fetch(`${BACKEND_HOST}:5000/api/holyday`, {
        method: "PUT",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({id: formData.get("id"), type: "reject", userId})
    })
    if (reject.status === 200){
        revalidateTag("company")
    }
}

export const onAcceptHolyday = async(formData: FormData, userId: string)=>{
    const accept = await fetch(`${BACKEND_HOST}:5000/api/holyday`, {
        method: "PUT",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({id: formData.get("id"), type: "accept", userId})
    })
    if (accept.status === 200){
        revalidateTag("company")
    }
}

export const onStartShift = async(formData: FormData)=>{
    const companyId = cookies().get("company-id")?.value
    const token = cookies().get("auth-token")?.value
    const data = formData.get("shift")
    if(token){
        const currentShift = await fetch(`${BACKEND_HOST}:5000/api/tracker`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({companyId, state: data ? data.toString().split(",")[2] : undefined, shiftId: data ? data?.toString().split(",")[0] : undefined})
        })
        if (currentShift.status === 200) revalidateTag("tracker")
    }
    
}

export const onEndShift = async(formData: FormData)=>{
    const companyId = cookies().get("company-id")?.value
    const token = cookies().get("auth-token")?.value
    const [shiftId, hourId, state] = formData.get("shift")!!.toString().split(",")
    if(token){
        const endShift = await fetch(`${BACKEND_HOST}:5000/api/tracker`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({companyId, shiftId, hourId, state})
        })
        if (endShift.status === 200) revalidateTag("tracker")
    }
    
}

export const onPauseShift = async(formData: FormData)=>{
    const companyId = cookies().get("company-id")?.value
    const token = cookies().get("auth-token")?.value
    const [shiftId, hourId] = formData.get("shift")!!.toString().split(",")
    if(token){
        const pauseShift = await fetch(`${BACKEND_HOST}:5000/api/tracker`,{
            method: "PUT",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({companyId, shiftId, hourId})
        })
        if (pauseShift.status === 200) revalidateTag("tracker")
    }
}

export const onGetEmployeesHours = async(date: string[])=>{
    const companyId = cookies().get("company-id")
    const getHours = await fetch(`${BACKEND_HOST}:5000/api/payroll?companyId=${companyId}&from=${date[0]}&to=${date[1]}`,{
        next: {revalidate: 0}
    })
    if (getHours.status !== 200) return []
    return await getHours.json() as Payroll[]
}

export const onCreateJob = async(formData: FormData)=>{
    const data = getFormValues(formData.entries())
    const token = cookies().get("auth-token")?.value
    if (token){
        const createJob = await fetch(`${BACKEND_HOST}:5000/api/job`,{
            method: "POST",
            headers: [["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify(data)
        })
    }
}

const getFormValues = (data: IterableIterator<[string, FormDataEntryValue]>)=>{
    const values:{[key: string]: any} = {}
    let cursor = data.next()
    while(!cursor.done){
        values[cursor.value[0]] = cursor.value[1]
        cursor = data.next()
    }
    return values
}