"use client"

import { UserContextTypes } from "@/app/layout"
import { GetCookie } from "@/util/lib"
import React, { useEffect, useState } from "react"

interface Props {
    children: React.ReactNode
}

export const userContext = React.createContext<[UserContextTypes, (u: UserContextTypes)=>void]>([{user_id: "", user_lastname: ""}, (user: UserContextTypes)=>{}])

const UserContext:React.FC<Props> = ({children})=>{
    const UserContext = userContext
    const [user, setUser] = useState<UserContextTypes>({user_id: "", user_lastname: ""})
    const onUserStateChange = (user: UserContextTypes):void=>{
        setUser(user)
    }
    useEffect(()=>{
        const id = GetCookie("id")
        const name = GetCookie("lastname")
        if(id && name){
            onUserStateChange({user_id: id, user_lastname: name})
        }
    }, [])
    return (
        <UserContext.Provider value={[user, onUserStateChange]}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext