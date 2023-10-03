import { component$ } from "@builder.io/qwik"
import { type DocumentHead, Link } from "@builder.io/qwik-city"

import Planning from "~/media/planning.webp?jsx"

import style from "./style.module.css"

export default component$(() => {
  return (
    <div class={style.landpage}>
      <div class={style.landpage_header}>
        <h1 class={style.landpage_header_title}>Connected</h1>
        <h2 class={style.landpage_header_sub}>La meilleur solution pour votre entreprise</h2>
        <Link href="/sign" class={style.landpage_header_start}>Commencer</Link>
      </div>
      <div class={style.landpage_planning}>
        <h1 class={style.landpage_planning_header}>Plannings</h1>
        <div class={style.landpage_planning_about}>
          <Planning alt="planning" class={style.landpage_planning_about_photo} />
          <h3>Gerer le planning de votre entreprise</h3>
        </div>
      </div>
      <div>
        <h1></h1>
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
