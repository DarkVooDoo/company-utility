import { QRL, Signal, createContextId } from "@builder.io/qwik"
import { CalendarArray } from "./types"

export const BACKEND_HOST = "http://localhost"

export const MONTH = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

export const userContext = createContextId<[Signal<{user_id: string, user_name: string}>, QRL<(id?: string, name?: string) => void>]>("user")

export const CreateCookie = (cookieName: string, value: string, maxAge: number, path: string = "/", secure: boolean = true)=>{
    document.cookie = `${cookieName}=${value};path=${path};max-age=${maxAge}`
}

export const GetCookie = (cookieName: string):string | undefined=>{
    const selectedCookie = document.cookie.split(";").map(cookie=>cookie.trim()).filter(cookie=>cookie.startsWith(cookieName))[0]
    if(selectedCookie){
        return decodeURI(selectedCookie.split("=")[1])
    }
    return undefined
}

export const closeDialogOnBackdropClick = (dialog: HTMLDialogElement)=>{
    dialog.addEventListener("click", (event)=>{
        var rect = dialog.getBoundingClientRect();
        if (rect){
            var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                dialog.close();
            }
        }
    })
}

export const hasChanged = <TObj extends {}, Key extends keyof TObj>(initialArray: TObj[], compareTo: TObj[], properties: Key[]):[boolean, TObj[]]=>{
    const changes: any = []
    let hasChanged = false
    for(let i = 0; i < initialArray.length; i++){
        for(let x = 0; x < properties.length; x++){
            if(initialArray[i][properties[x]] !== compareTo[i][properties[x]]){
                hasChanged = true
                changes.push(compareTo[i])
            }
        }
    }
    
    return [hasChanged, changes]
}

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

export const GetMonthArray = (year: number, monthIndex: number):CalendarArray=>{
    const monthArray = new Array(42).fill(0)
    const dayAmount = GetYearDays(year, monthIndex)
    let to: string  = `${year}-${monthIndex < 10 ? "0"+monthIndex : monthIndex.toString()}-${dayAmount.monthDays.toString()}`
    let from: string = `${year}-${monthIndex < 10 ? "0"+monthIndex : monthIndex.toString()}-${dayAmount.monthDays.toString()}`
    const calendar = monthArray.map((_, index):{isCurrentMonth: boolean, dayNumber: number, month: number}=>{
        const thisMonth = new Date(year, monthIndex, 0)
        let dayNumber = 0
        let isCurrentMonth = false
        let month = monthIndex
        if(index+1 > thisMonth.getDay() && index-thisMonth.getDay() < dayAmount.monthDays){
            dayNumber = index+1-thisMonth.getDay()
            isCurrentMonth = true
            month = monthIndex
        }else if(index-thisMonth.getDay() >= dayAmount.monthDays){
            const nextMonth = dayAmount.monthIndex === 11 ? GetYearDays(year+1, 0) : GetYearDays(year, dayAmount.monthIndex + 1)
            dayNumber = index+1 - thisMonth.getDay() - dayAmount.monthDays
            isCurrentMonth = false
            month = nextMonth.monthIndex
            if (index === 41){
                to = `${nextMonth.year}-${(nextMonth.monthIndex + 1) < 10 ? "0"+(nextMonth.monthIndex + 1)  : (nextMonth.monthIndex + 1).toString()}-${dayNumber < 10 ? "0"+dayNumber : dayNumber.toString()}`
            }
        }else{
            const lastMonth = dayAmount.monthIndex === 0 ? GetYearDays(year-1, 11) : GetYearDays(year, dayAmount.monthIndex - 1)
            dayNumber = lastMonth.monthDays - thisMonth.getDay() + index +1
            isCurrentMonth = false
            month = lastMonth.monthIndex
            if (index === 0){
                from = `${lastMonth.year}-${(lastMonth.monthIndex+1) < 10 ? "0"+(lastMonth.monthIndex+1) : (lastMonth.monthIndex+1).toString()}-${dayNumber < 10 ? "0"+dayNumber : dayNumber.toString()}` 
            }
        }
        return {isCurrentMonth, dayNumber, month}            
    })
    return {calendar, to, from}
}

export const GetYearDays = (year: number, month: number)=>{

    if(month !== 1){
        return {year, monthDays: MONTH_DAYS[month], month: MONTHS[month], monthIndex: month}
    }else{
        if(year % 4 === 0){
            if(year % 100 !== 0){
                return {year, monthDays: MONTH_DAYS[month]+1, month: MONTHS[month], monthIndex: month}
            }
            if(year % 100 === 0 && year % 400 === 0){
                return {year, monthDays: MONTH_DAYS[month]+1, month: MONTHS[month], monthIndex: month}
            }else{
                return {year, monthDays: MONTH_DAYS[month], month: MONTHS[month], monthIndex: month}
            }
        }else {
            return {year, monthDays: MONTH_DAYS[month], month: MONTHS[month], monthIndex: month}
        }
    }
}

export const SecondsToHour = (seconds: number)=>{
    return `${Math.floor(seconds / (60*60))}:${Math.floor(seconds % (60*60) / 60)}:${seconds % 60}`
}