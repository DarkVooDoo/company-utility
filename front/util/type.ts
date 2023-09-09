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