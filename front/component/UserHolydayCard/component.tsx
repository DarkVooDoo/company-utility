import { Holyday } from "@/util/type"
import { CSSProperties } from "react"

import style from "./style.module.css"

interface Props{
    holyday: Holyday
}


const UserHolydayCard:React.FC<Props> = ({holyday})=>{
    let statusBubbleColor:CSSProperties
    switch(holyday.status){
        case "Validé":
            statusBubbleColor = {backgroundColor: "greenyellow"}
            break
        case "Refusé":
            statusBubbleColor = {backgroundColor: "red"}
            break
        default :
            statusBubbleColor = {backgroundColor: "orange"}
            break
    }
    return (
        <div className={style.holyday_content}>
            <h3 className={style.holyday_content_name}>John Doe </h3>
            <p className={style.holyday_content_ago}>Il y a {holyday.time} </p>
            <p className={style.holyday_content_date}>Du {holyday.from} Au {holyday.to} </p>
            <div className={style.holyday_content_status}>
                <div className={style.holyday_content_status_bubble} style={statusBubbleColor} /><p>{holyday.status} </p>
            </div>
            {false && <div className={style.dashboard_holydays_controls}>
                <button type="submit" className={style.dashboard_holydays_controls_btn} name='id' value={holyday.id} >Refusé</button>
                <button type="submit" className={style.dashboard_holydays_controls_btn} name='id' value={holyday.id}>Accepté</button>
            </div>}
        </div>
    )
}

export default UserHolydayCard