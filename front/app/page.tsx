
import style from './page.module.css'

const Home = async ()=> {
  return (
    <div className={style.main}>
      <div className={style.landpage_header}>
        <h1 className={style.landpage_header_text}>Gerez vos plannings</h1>
      </div>
      <div>
        <h1>Plannings</h1>
        <div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi deserunt modi sit fuga obcaecati voluptatem quisquam adipisci ut quo dolorem. </p>
          <p>Photo preview des plannings</p>
        </div>
      </div>
    </div>
  )
}

export default Home