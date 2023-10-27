import { component$, useSignal } from "@builder.io/qwik"
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city"

import style from "./style.module.css"
import CustomSelect from "~/components/CustomSelect/component"
import { BACKEND_HOST } from "~/lib/util"

export const useGetFiche = routeAction$(async (form)=>{
    const {brut} = form
    const createFiche = await fetch(`${BACKEND_HOST}:5000/api/payroll`,{
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({salary: parseFloat(brut)})
    })
},zod$({
    brut: z.string()
}))

const NewEmployee = component$(()=>{
    const getFiche = useGetFiche()
    const salaryRef = useSignal<HTMLElement>()

    const salary = useSignal<string>("1747.20")
    const hebdomadaire = useSignal("35")

    return (
        <Form class={style.newEmployee} action={getFiche}>
            <h1>Employé</h1>
            <section class={style.newEmployee_section}>
                <div class={style.newEmployee_field}>
                    <label for="matricule">Maatricule</label>
                    <input type="text" name="matricule" id="matricule" class={style.newEmployee_field_input} />
                </div>
                <div class={style.newEmployee_field}>
                    <label for="status">Status</label>
                    <input type="text" name="status" id="status" class={style.newEmployee_field_input} />
                </div>
                <div class={style.newEmployee_field}>
                    <label for="convention">Convention collective</label>
                    <input type="text" name="convention" id="convention" class={style.newEmployee_field_input} />
                </div>
                <div class={style.newEmployee_field}>
                    <label for="position">Poste</label>
                    <input type="text" name="position" id="position" class={style.newEmployee_field_input} />
                </div>
                <div class={style.newEmployee_field}>
                    <label for="joined">à Rejoins l'entreprise le</label>
                    <input type="date" name="joined" id="joined" class={style.newEmployee_field_input} />
                </div>
                {/* <CustomSelect /> */}
            </section>
            <h1>Salaire</h1>
            <section class={style.newEmployee_section} ref={salaryRef}>
                <div>
                    <label for="time">Heures Hebdomadaire</label>
                    <input type="number" name="time" id="time" class={style.newEmployee_field_input} bind:value={hebdomadaire}/>
                </div>
                <div>
                    <label for="brut">Salaire Brut</label>
                    <input type="number" name="brut" id="brut" class={style.newEmployee_field_input} step="0.01" bind:value={salary} />
                </div>
                <p>{(parseInt(salary.value) / (parseInt(hebdomadaire.value) * 52 / 12)).toFixed(2)} </p>
                <button type="button">Nouveau Champ</button>

            </section>
            <h1>Santé</h1>
            <section class={style.newEmployee_section} ref={salaryRef}>
                <div>
                    <label for="mutuelle">Prix Mutuelle</label>
                    <input type="number" name="mutuelle" id="mutuelle" class={style.newEmployee_field_input} value="50" />
                </div>
                <div>
                    <label for="pourcentage">Pourcentage patronal</label>
                    <input type="number" name="pourcentage" id="pourcentage" class={style.newEmployee_field_input} min="50" value="50" />
                </div>
                <button type="button" onClick$={()=>{

                }}>Nouveau Champ</button>

            </section>
            <button type="submit">Get Fiche</button>
        </Form>
    )
})

export default NewEmployee