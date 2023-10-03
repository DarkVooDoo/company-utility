import { component$ } from "@builder.io/qwik"
import { DocumentHead, Link, routeAction$, routeLoader$, useLocation, useNavigate} from "@builder.io/qwik-city"

import LeftArrow from "~/media/left-arrow.webp?jsx"
import Dollar from "~/media/dollar.webp?jsx"
import Company from "~/media/companie.webp?jsx"

import style from "./style.module.css"
import UserHolydayCard from "~/components/UserHolydayCard/component"
import { BACKEND_HOST } from "~/lib/util"
import { Entreprise } from "~/lib/types"

export const useDeleteCompany = routeAction$(async(form, req):Promise<{success: boolean}>=>{
    const token = req.cookie.get("auth-token")?.value
    const {id} = form
    if(token){
        const deleteCompany = await fetch(`${BACKEND_HOST}:5000/api/pro`, {
            method: "DELETE",
            headers:[["Content-Type", "application/json"], ["Authorization", token]],
            body: JSON.stringify({id})
        })
        if (deleteCompany.status === 200){
            return Promise.resolve({success: true})
        }
    }
    return Promise.resolve({success: false})
})

export const useGetCompany = routeLoader$(async(req)=>{
    const authToken = req.cookie.get("auth-token")?.value
      if (authToken){
          const fetchCompany = await fetch(`${BACKEND_HOST}:5000/api/pro?companyId=${req.params.id}`, {
              headers: [["Authorization", authToken]],
          })
          if (fetchCompany.status === 307){
              throw req.redirect(308, "/")
          }
          return await fetchCompany.json() as Entreprise
      }
      throw req.redirect(308, "/")
})

const Dashboard = component$(()=>{
    const {params} = useLocation()
    const nav = useNavigate()
    const deleteCompany = useDeleteCompany()
    const company = useGetCompany()
    // const shift = Test.map(shift=>(
    //     <div>
    //         <h1>{shift.user_name} </h1>
    //         <p>{shift.shift_start} </p>
    //         <p>{shift.shift_end} </p>
    //         <p>{shift.shift_pause} </p>
    //     </div>
    // ))
    // const job = JOBS.map(job=><JobCard {...{...job}} />)
    const pendingHolyday = company.value.holyday_pending.map(holyday=><UserHolydayCard key={holyday.id} {...{holyday, role: company.value.role}} />)
    return (
        <main class={style.dashboard}>
            <div class={style.dashboard_company}>
                {/* <Image src={user} alt="photo" /> */}
                <div>
                    <h1 >{company.value.name}</h1>
                    <p>Adresse {company.value.adresse}</p>
                </div>
            </div>
            <div class={style.dashboard_links}>
                <Link href={`/dashboard/${params.id}/employees`} class={style.dashboard_links_btn} >
                <Company alt="dollar" class={style.dashboard_links_btn_icon} />Employées
                </Link>
                <Link href={`/dashboard/${params.id}/payroll`} class={style.dashboard_links_btn}>
                    <Dollar alt="dollar" class={style.dashboard_links_btn_icon} />Payments
                </Link>
            </div>
            {/* <div class={style.dashboard_job}>
                <h1>Mes Annonces</h1>
                <Link href={`/dashboard/${id}/new-annonce`} class={style.dashboard_holydays_link}>Noveau <Image src={leftArrow} alt="fleche" class={style.dashboard_holydays_link_arrow} /> </Link>
            </div>
            {job} */}
            <div class={style.dashboard_holydays}>
                <div class={style.dashboard_holydays_header}>
                    <h1 >Congés</h1>
                    <Link href={`/dashboard/${params.id}/holyday`} class={style.dashboard_holydays_link}>Voir les congés <LeftArrow alt="fleche" class={style.dashboard_holydays_link_arrow} /> </Link>
                </div>
                <div class={style.dashboard_holydays_all}>
                    {pendingHolyday.length > 0 ? pendingHolyday : "Zero congé a gerer"}
                </div>
            </div>
            <button class={style.dashboard_deleteBtn} onClick$={async ()=>{
                const {value} = await deleteCompany.submit({id: company.value.id})
                if(value.success) nav("/profile/company")
            }}>Supprimer</button>
        </main>
    )
})

export const head:DocumentHead = ({resolveValue, params})=>{
    const company = resolveValue(useGetCompany)
    return {
        title: `${company.name}`
    }
}

export default Dashboard