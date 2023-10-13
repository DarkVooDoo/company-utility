export interface Holyday{
    id: string 
    from: string
    to: string 
    status: string
    time: string
    name: string
    user: string
}

export interface Profile {
    id: string
    joined: string
    firstname: string
    lastname: string
    adresse: string
    postal: string
    photo: string
    email: string
}

export interface Entreprise {
    role: {id: string, role: ROLE},
    name: string, adresse: string, id: string
    holyday_pending: Holyday[]
}

export interface DayShift {
    id: string;
    start: string;
    end: string;
    day: string;
}

export interface Payroll{
    name: string
    total: string
    seconds: number
    salary: number
    shift: {[key: string]: DayShift[]}
}

export interface ShiftTypes {
    user_id: string,
    user_name: string,
    role: string,
    shift_id: string,
    shift_date: string,
    shift_day: number,
    shift_month: number,
    shift_start: string,
    shift_pause: number,
    shift_end: string
}

export interface NewShift {
    user_id: string, 
    user_name: string,  
    shift_date: string[], 
    shift_start: string, 
    shift_end: string,
    shift_pause: number,
}

export interface Member {
    id: string
    name: string
    role: string
    user_id: string
}

export interface CurrentShift {
    id: string
    state: string
    hourId: string
    seconds: number
}

export type ROLE = "User" | "Admin" | "Boss"

export interface Calendar {
    isCurrentMonth: boolean
    dayNumber: number
    month: number
}

export interface CalendarArray{
    calendar: Calendar[],
    to: string
    from: string
} 