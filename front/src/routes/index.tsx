import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { type DocumentHead, Link } from "@builder.io/qwik-city"

import Planning from "~/media/planning.webp?jsx"
import Arrow from "~/media/left-arrow.webp?jsx"
import Dollar from "~/media/dollar.webp?jsx"

import style from "./style.module.css"

export default component$(() => {
  const testRef = useSignal<HTMLDivElement>()
  useVisibleTask$(()=>{
    const body = document.querySelector("main")
    body?.addEventListener("scroll", ()=>{
      console.log("scolled")
    })
  })
  return (
    <div ref={testRef} class={style.landpage}>
      <div class={style.landpage_header}> 
        <h1 class={style.landpage_header_title}>Connected</h1>
        <h2 class={style.landpage_header_sub}>La meilleur solution pour votre entreprise</h2>
        <Link href="/sign" class={style.landpage_header_start}>Commencer</Link>
        <Arrow alt="arrow" class={style.landpage_header_arrow} />
      </div>
      <div class={style.landpage_planning}>
        <h1 class={style.landpage_planning_header}>Caractéristiques</h1>
        <div class={style.landpage_planning_topic}>
          <div class={style.landpage_planning_topic_about}>
            <h2>Planning</h2>
            <Planning alt="planning" class={style.landpage_planning_about_photo} />
            <h4>Gerer le planning de votre entreprise</h4>
          </div>
          <div class={style.landpage_planning_topic_about}>
            <h2>Congés</h2>
            <Planning alt="planning" class={style.landpage_planning_about_photo} />
            <h4>Gerer les congés de vos employees</h4>
          </div>
          <div class={style.landpage_planning_topic_about}>
            <h2>Paie</h2>
            <Dollar alt="paie" class={style.landpage_planning_about_photo} />
            <h4>Voir vos revenues</h4>
          </div>
        </div>
      </div>
      <div>
        <h1>Pourquoi connected?</h1>
        <h2>Gerer votre entreprise avec une seule app</h2>
      </div>
    </div>
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
