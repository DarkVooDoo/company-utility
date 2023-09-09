import { onCreateJob } from "@/app/actions"
import style from "./style.module.css"

const NewJob = ()=>{
    return(
        <main>
            <form action={onCreateJob} className={style.newjob}>
                <div className={style.newjob_sInput}>
                    <label htmlFor="title" className={style.newJob_label}>Titre</label>
                    <input type="text" name="title" id="title" autoComplete="off" className={style.newjob_sInput_input} />
                </div>
                <div className={style.newjob_sInput}>
                    <label htmlFor="desc" className={style.newJob_label}>Description</label>
                    <input type="text" name="desc" id="desc" autoComplete="off" className={style.newjob_sInput_input} />
                </div> 
                <h3 className={style.newJob_label}>Contrat</h3>
                <div className={style.newjob_contract}>
                    <div>
                        <label htmlFor="cdd">CDD</label>
                        <input type="radio" name="type" id="cdd" value={"CDD"} />
                    </div>
                    <div>
                        <label htmlFor="cdi">CDI</label>
                        <input type="radio" name="type" id="cdi" value={"CDI"} />
                    </div>
                </div>
                <div>
                    <h3 className={style.newJob_label}>Information</h3>
                    <textarea name="about" id="about" className={style.newJob_information}></textarea>
                </div>
                <div>
                    <label htmlFor="expire" className={style.newJob_label}>Date d'expiration</label>
                </div>
                <input type="date" name="expire" id="expire" />
                <div>
                    <button type="submit">Creer</button>
                </div>
            </form>
        </main>
    )
}

export default NewJob