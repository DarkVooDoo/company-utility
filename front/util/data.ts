import {cookies} from "next/headers"
import { redirect } from "next/navigation"

export interface Profile {
    id: string,
    joined: string,
    firstname: string,
    lastname: string,
    adresse: string,
    postal: string,
    email: string
}

export const getUserProfile = async ():Promise<Profile>=>{
    const token = cookies().get("auth-token")
    if (token){
        const fetchProfile = await fetch(`http://localhost:5000/api/user`,{
            headers: [["Accept", "application/json"], ["Authorization", token.value]],
            next:{revalidate: 0}
        })
        return await fetchProfile.json() as Profile
    }
    return new Promise((resolve, rej)=>{
        resolve({adresse: "", email: "", firstname: "", id: "", joined: "", lastname: "", postal: ""})
    })
}

export const GetMyCompany = async (companyId: string):Promise<unknown>=>{
    const authToken = cookies().get("auth-token")?.value
    if (authToken){
        const fetchCompany = await fetch(`http://localhost:5000/api/pro?companyId=${companyId}`, {
            headers: [["Authorization", authToken]],
            next: {revalidate: 0}
        })
        if (fetchCompany.status === 307){
            redirect("/")
        }
        return await fetchCompany.json()
    }
}
 
export const GetCompanys = async (type: string):Promise<{id: string, name: string, adresse: string, postal: number}[]>=>{
    const token = cookies().get("auth-token")
    if (token){
        const fetchCompany = await fetch(`http://localhost:5000/api/pro?type=${type}`,{
            headers: [["Authorization", token.value]],
            next: {revalidate: 0}
        })
        return await fetchCompany.json() as {id: string, name: string, adresse: string, postal: number}[]
    }
    return []
}

export const GetNotification = async()=>{
    const token = cookies().get("auth-token")?.value
    if (token){
        const fetchNotif = await fetch(`http://localhost:5000/api/notif`, {
            headers: [["Authorization", token]],
            next: {revalidate: 60*5}
        })
        if (fetchNotif.status === 200){
            return await fetchNotif.json() || []
        }
    }else{
        return []
    }
}

export const GetTodayShift =async () => {
    const [day, month, year] = new Date().toLocaleDateString().split("/")
    const token = cookies().get("auth-token")?.value
    if (token){
        const fetchShift = await fetch(`http://localhost:5000/api/shift?date=${year}-${month}-${day}&cId=${cookies().get("company-id")?.value}`,{
            headers: [["Authorization", token], ["Accept", "application/json"]]
        })
        if (fetchShift.status === 200){
            const body = await fetchShift.json()
            return body
        }
    }
}