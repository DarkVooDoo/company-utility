export interface Holyday{
    id: string 
    from: string
    to: string 
    status: string
    time: string
    name: string
    user: string
}

export interface CurrentShift {
    id: string
    state: string
    hourId: string
}

export type ROLE = "User" | "Admin" | "Boss"

export interface Entreprise {
    role: {id: string, role: ROLE},
    name: string, adresse: string, 
    holyday_pending: Holyday[]
}
export interface Member {
    id: string
    name: string
    role: string
    user_id: string
}

export interface Payroll{
    name: string
    total: string
    seconds: number
    salary: number
    shift: {[key: string]: {id: string, start: string, end: string, day: string}[]}
}