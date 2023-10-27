import { component$, useSignal, useStore } from "@builder.io/qwik"

import style from "./style.module.css"
import { routeAction$, z, zod$ } from "@builder.io/qwik-city"

import Close from "~/media/close.svg?jsx"

import {Curriculum, WorkSchool} from "~/lib/types"
import { BACKEND_HOST } from "~/lib/util"

export const useCreateCurriculum = routeAction$(async (form, req)=>{
    const token = req.cookie.get("auth-token")?.value
    if(!token) return
    // const formData = new FormData()
    // for(const [key, value] of Object.entries(form)){
    //     formData.append(key, value.toString())
    // }
    const createCurriculum = await fetch(`${BACKEND_HOST}:5000/api/curriculum`,{
        method: "POST",
        headers: [["Authorization", token], ["Content-Type", "application/json"]],
        body: JSON.stringify({...form})
    })
},zod$({
    photo: z.string(),
    poste: z.string(),
    profil: z.string(),
    skill: z.array(z.object({value: z.string(), level: z.number()})),
    langue:  z.array(z.object({value: z.string(), level: z.number()})),
    school: z.array(z.object({
        title: z.string(),
        location: z.string(),
        establishment: z.string(),
        from: z.string(),
        to: z.string(),
        description: z.array(z.string())
    })),
    work: z.array(z.object({
        title: z.string(),
        location: z.string(),
        establishment: z.string(),
        from: z.string(),
        to: z.string(),
        description: z.array(z.string())
    }))
}))

const Curriculum = component$(()=>{
    const createCurriculum = useCreateCurriculum()
    const skillRef = useSignal<HTMLDivElement>()
    const step = useSignal(0)
    const photo = useSignal("")
    const photoUrl = useSignal("")
    const langue = useSignal<{value: string, level: number}[]>([{value: "", level: 1}])
    const skill = useSignal<{value: string, level: number}[]>([{value: "", level: 1}])
    const work = useStore<WorkSchool[]>([{title: "", establishment: "", location: "", from: "", to: "", description: [""]}])
    const school = useStore<WorkSchool[]>([{title: "", establishment: "", location: "", from: "", to: "", description: [""]}])

    const curriculum = useStore({
        poste: "", 
        profil: "",
    })

    const skillField = skill.value.map((_, index)=>{
        return (
             <div key={Math.random()} class={style.curriculum_form_langueSkill}>
                <div class={style.curriculum_form_langueSkill_field}>
                    <input type="text" name="skill" id="skill" placeholder="Travail en equipe" value={skill.value[index].value} class={style.curriculum_form_langueSkill_field_input} onInput$={(_,ele)=>{
                        skill.value[index].value = ele.value
                    }} />
                </div>
                <div class={style.curriculum_form_langueSkill_field}>
                    <input type="number" name="skillLevel" id="skillLevel" step={1} max={5} min={1} value={skill.value[index].level} class={style.curriculum_form_langueSkill_field_input} onInput$={(_,ele)=>{
                        skill.value[index].level = parseInt(ele.value)
                    }} />
                </div>
                <button type="button" class={style.curriculum_form_langueSkill_removeBtn} onClick$={()=>{
                    skill.value.splice(index, 1)
                    skill.value = [...skill.value]
                }}><Close class={style.curriculum_form_langueSkill_removeBtn_icon} /></button>
             </div>
        )
    })
    const langueField = langue.value.map((_, index)=>{
        return (
             <div key={Math.random()} class={style.curriculum_form_langueSkill}>
                <div class={style.curriculum_form_langueSkill_field}>
                    <input type="text" name="langue" id="langue" placeholder="Espagnol" value={langue.value[index].value} class={style.curriculum_form_langueSkill_field_input} onInput$={(_,ele)=>{
                        langue.value[index].value = ele.value
                    }} />
                </div>
                <div class={style.curriculum_form_langueSkill_field}>
                    <input type="number" name="langueLevel" id="langueLevel" step={1} max={5} min={1} value={langue.value[index].level} class={style.curriculum_form_langueSkill_field_input} onInput$={(_,ele)=>{
                        langue.value[index].level = parseInt(ele.value)
                    }} />
                </div>
                <button type="button" class={style.curriculum_form_langueSkill_removeBtn} onClick$={()=>{
                    langue.value.splice(index, 1)
                    langue.value = [...langue.value]
                }}><Close class={style.curriculum_form_langueSkill_removeBtn_icon} /></button>
             </div>
        )
    })
    return (
        
        <div class={style.curriculum}>
            {step.value === 0 ? <>
                <h1 class={style.curriculum_topContent_header}>{step.value+1}. Vous</h1>
                <div class={style.curriculum_photo}>
                    {photoUrl.value === "" ? <div class={style.curriculum_photo_content} /> : <img src={photoUrl.value} alt="photo" class={style.curriculum_photo_label} />}
                    <label for={style.userPhoto} class={style.curriculum_photo_label}>{photoUrl.value !== "" ? "" : "Photo"} </label>
                    <input type="file" name="userPhoto" id={style.userPhoto} accept="image/*" onChange$={(e)=>{
                        const files = e.target.files
                        if(!files) return
                        const fileReader = new FileReader()
                        fileReader.addEventListener("load", (data)=>{
                            const payload = data.target?.result
                            if(typeof payload !== "string") return
                            const base64 = payload.substring(payload.indexOf(",", 1)+1, payload.length)
                            photo.value = base64
                            photoUrl.value = payload
                        })
                        fileReader.readAsDataURL(files[0])
                    }} />
                </div>
                <div>
                    <label for="poste">Poste</label>
                    <input type="text" name="poste" class={style.curriculum_form_input} id="poste" value={curriculum.poste} onInput$={(_,ele)=>curriculum.poste = ele.value} />
                </div>
                <div>
                    <label for="profil">Profile</label>
                    <textarea name="profil" id="profil" value={curriculum.profil} class={style.curriculum_form_profil} onInput$={(_,ele)=>curriculum.profil = ele.value} />
                </div>
                <div class={style.curriculum_form_container}>
                    <div class={style.curriculum_form_langueSkill}>
                        <div>Compétence</div>
                        <div>Niveau</div>
                        <div></div>
                    </div>
                    {skillField}
                    <button type="button" class={style.newFieldBtn} onClick$={()=>{
                        skill.value = [...skill.value, {value: "", level: 1}]
                    }}>Nouvelle Compétence</button>
                </div>
                <div class={style.curriculum_form_container}>
                    <div class={style.curriculum_form_langueSkill}>
                        <div>Langue</div>
                        <div>Niveau</div>
                        <div></div>
                    </div>
                    {langueField}
                    <button type="button" class={style.newFieldBtn} onClick$={()=>{
                        langue.value = [...langue.value, {value: "", level: 1}]
                    }}>Nouvelle Langue</button>
                </div>
            </> : null}
            {step.value === 1 ? 
            <div>
                <div class={style.curriculum_topContent}>
                    <h1 class={style.curriculum_topContent_header}>{step.value+1}. Formation</h1>
                    <button class={style.curriculum_topContent_btn} onClick$={()=>{
                        work.push({description: [""], establishment: "", location: "", to: "", from: "", title: ""})
                    }}>Nouvelle</button>
                </div>
                {school.map((mySchool, index)=>(
                    <>
                        <b>{index+1}. </b>
                        <div class={style.curriculum_work}>
                            <div>
                                <label for="diploma">Diploma</label>
                                <input type="text" class={style.curriculum_form_input} name="diploma" id="diploma" value={mySchool.title} onInput$={(_,ele)=>{school[index].title = ele.value}} />
                            </div>
                            <div>
                                <label for="establishment">Etablishment</label>
                                <input type="text" class={style.curriculum_form_input} name="establishment" id="establishment" value={mySchool.establishment} autoComplete={"off"} onInput$={(_,ele)=>{school[index].establishment = ele.value}}/>
                            </div>
                            <div>
                                <label for="locatio ">Location</label>
                                <input type="text" class={style.curriculum_form_input} name="locatio " id="locatio " value={mySchool.location} autoComplete={"off"} onInput$={(_,ele)=>{school[index].location = ele.value}}/>
                            </div>
                            <div class={style.curriculum_date}>
                                <div>
                                    <label for="from">Du</label>
                                    <input type="date" class={style.curriculum_form_input} name="from" id="from" value={mySchool.from} autoComplete={"off"} onInput$={(_,ele)=>{school[index].from = ele.value}}/>
                                </div>
                                <div>
                                    <label for="to">Au</label>
                                    <input type="date" class={style.curriculum_form_input} name="to" id="to" value={mySchool.to} autoComplete={"off"} onInput$={(_,ele)=>{school[index].to = ele.value}}/>
                                </div>
                            </div>
                            {school[index].description.map((description, descIndex)=>(
                                <div key={Math.random()} class={style.curriculum_detail}>
                                    <label for="description">Detail</label>
                                    <input type="text" class={style.curriculum_form_input} name="description" id="description" value={description} autoComplete={"off"} onChange$={(e,ele)=>{
                                        school[index].description[descIndex] = ele.value
                                    }}/>
                                </div>
                            ))}
                            <button type="button" class={style.curriculum_detailBtn} onClick$={()=>{
                                // school[index].description = [...desc.value, ""]
                                school[index].description.push("")
                            }}>Nouveau Detail</button>
                        </div>
                    </>
                ))}
            </div> : null}
            {step.value === 2 ? 
            <div>
                <div class={style.curriculum_topContent}>
                    <h1 class={style.curriculum_topContent_header}>{step.value+1}. Experience Professionnel</h1>
                    <button class={style.curriculum_topContent_btn} onClick$={()=>{
                        work.push({description: [""], establishment: "", location: "", to: "", from: "", title: ""})
                    }}>Nouvelle</button>
                </div>
                {work.map((myWork, index)=>(
                    <>
                        <b>{index+1}. </b>
                        <div class={style.curriculum_work}>
                            <div>
                                <label for="title">Poste</label>
                                <input type="text" class={style.curriculum_form_input} name="title" id="title" value={myWork.title} onInput$={(_,ele)=>{work[index].title = ele.value}} />
                            </div>
                            <div>
                                <label for="establishment">Etablishment</label>
                                <input type="text" class={style.curriculum_form_input} name="establishment" id="establishment" value={myWork.establishment} autoComplete={"off"} onInput$={(_,ele)=>{work[index].establishment = ele.value}}/>
                            </div>
                            <div>
                                <label for="location ">Location</label>
                                <input type="text" class={style.curriculum_form_input} name="location " id="location " value={myWork.location} autoComplete={"off"} onInput$={(_,ele)=>{work[index].location = ele.value}}/>
                            </div>
                            <div class={style.curriculum_date}>
                                <div>
                                    <label for="from">Du</label>
                                    <input type="date" class={style.curriculum_form_input} name="from" id="from" value={myWork.from} autoComplete={"off"} onInput$={(_,ele)=>{work[index].from = ele.value}}/>
                                </div>
                                <div>
                                    <label for="to">Au</label>
                                    <input type="date" class={style.curriculum_form_input} name="to" id="to" value={myWork.to} autoComplete={"off"} onInput$={(_,ele)=>{work[index].to = ele.value}}/>
                                </div>
                            </div>
                            {work[index].description.map((description, descIndex)=>(
                                <div key={Math.random()} class={style.curriculum_detail}>
                                    <label for="description">Detail</label>
                                    <input type="text" class={style.curriculum_form_input} name="description" id="description" value={description} autoComplete={"off"} onChange$={(e,ele)=>{
                                        work[index].description[descIndex] = ele.value
                                    }}/>
                                </div>
                            ))}
                            <button type="button" class={style.curriculum_detailBtn} onClick$={()=>{
                                // work[index].description = [...desc.value, ""]
                                work[index].description.push("")
                            }}>Nouveau Detail</button>
                        </div>
                    </>
                ))}
            </div> : null}
            <div class={style.curriculum_step}>
                <button type="button" class={style.curriculum_step_backBtn} style={step.value !== 0 ? {visibility: "visible"} : {visibility: "hidden"}} onClick$={()=>{step.value = step.value - 1}}>Retour</button>
                <button type="button" class={style.curriculum_step_nextBtn} onClick$={async ()=>{
                    if(step.value === 2){
                        //Send Create Curriculum
                        const saveCurriculum = await createCurriculum.submit({
                            photo: photo.value,
                            langue: langue.value, 
                            skill: skill.value, 
                            ...curriculum, 
                            school: [...school], 
                            work: [...work]
                        })
                        return
                    }
                    step.value = step.value + 1
                }}>{step.value === 2 ? "Creer curriculum" : "Suivant"} </button>
            </div>
        </div>
    )
})

export default Curriculum