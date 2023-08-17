import { CSSProperties, useState } from "react"

interface ToggleButtonProps {
    color: string,
    onStateChange: (newState: boolean)=> void
}

const ToggleButton:React.FC<ToggleButtonProps> = ({color, onStateChange})=>{
    const [isActive, setIsActive] = useState(false)
    return (
        <div style={{...style.toggle, backgroundColor: `${isActive ? color : "lightgray"}`}} onClick={()=>{
            setIsActive(state=>!state)
            onStateChange(!isActive)
        }}>
            <div style={{...style.toggle_state, left: `${isActive ? "2.15rem" : "2px"}`}} />
        </div>
    )
}

const style:{[key: string]:CSSProperties} = {
    toggle:{
        position: "relative",
        height: "2rem",
        width: "4rem",
        borderRadius: "25px",
        transition: ".3s linear all"
    },
    toggle_state:{
        position: "absolute",
        left: "2px",
        top: ".15rem",
        width: "1.7rem",
        height: "1.7rem",
        backgroundColor: "white",
        borderRadius: "50%",
        transition: ".3s linear all"
    }
}

export default ToggleButton