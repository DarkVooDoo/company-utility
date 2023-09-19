import Link from "next/link"
import Image from "next/image"
import planning from "@/public/planning.jpg"

import style from './page.module.css'

const Home = async ()=> {
  return (
    <div className={style.main}>
      <div className={style.landpage_header}>
        <h1 className={style.landpage_header_title}>Connected</h1>
        <h3 className={style.landpage_header_sub}>Rester connecté avec vos employées</h3>
        <Link href="/sign" className={style.landpage_header_start}>Commencer</Link>
      </div>
      <div className={style.landpage_planning}>
        <h1 className={style.landpage_planning_header}>Plannings</h1>
        <div className={style.landpage_planning_about}>
          <p>Gerer les planning, congés et les heures travaillé par vos employées</p>
          <Image src={planning} alt="planning" className={style.landpage_planning_about_photo} />
        </div>
      </div>
      <div>
        <h1></h1>
      </div>
    </div>
  )
}

export default Home