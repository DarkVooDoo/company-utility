"use client"

import { onChangeMemberRole } from "@/app/actions"
import SelectOption from "./SelectOption"

interface Props{
    currentRole: string, 
    roles: {memberId: string, role: string}[]
}

const ChangeUserRole:React.FC<Props> = ({currentRole, roles})=>{
    return (
        <SelectOption items={roles} value={currentRole} render={(role)=><form action={onChangeMemberRole} key={Math.random()}>
            <button type="submit" name="newRole" style={{height: "2rem", width: "100%", justifyContent: "center"}} value={JSON.stringify({id: role.memberId, role: role.role})}>{role.role}</button>  
        </form>}  />
    )
}

export default ChangeUserRole