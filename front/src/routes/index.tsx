import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

import style from "./style.module.css"

export default component$(() => {
  return (
    <>
      <div class={style.landpage_header}>
        <h1 class={style.landpage_header_title}>Connected</h1>
        <h3 class={style.landpage_header_sub}>Rester connecté avec vos employées</h3>
        {/* <Link href="/sign" class={style.landpage_header_start}>Commencer</Link> */}
      </div>
      <div class={style.landpage_planning}>
        <h1 class={style.landpage_planning_header}>Plannings</h1>
        <div class={style.landpage_planning_about}>
          <p>Gerer les planning, congés et les heures travaillé par vos employées</p>
          {/* <Image src={planning} alt="planning" class={style.landpage_planning_about_photo} /> */}
        </div>
      </div>
      <div>
        <h1></h1>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Bienvenue chez Connected",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
