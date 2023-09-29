import { component$, Slot, useContextProvider, $, useSignal } from "@builder.io/qwik"
import { routeLoader$ } from "@builder.io/qwik-city"
import type { RequestHandler } from "@builder.io/qwik-city"

import Navbar from "~/components/Navbar/component"
import { Entreprise, Holyday, Profile } from "~/lib/types"
import { BACKEND_HOST, userContext } from "~/lib/util"

export const onRequest: RequestHandler = async ({pathname, cookie, redirect, next, sharedMap})=>{
  const token = cookie.get("auth-token")?.value
  if(token){
    const authorize = await fetch(`http://localhost:5000/api/auth`, {
        headers: [["Authorization", token]]
    })
    if(authorize.status === 200){
        const user = await authorize.json() as {user_id: string, user_name: string, user_token: string}
        cookie.set("auth-token", user.user_token, {maxAge: 60*60*5, path: "/"})
        cookie.set("user_name", user.user_name, {maxAge: 60*60*5, path: "/"})
        cookie.set("id", user.user_id, {maxAge: 60*60*5, path: "/"})
        if(pathname === "/"){
          const company = cookie.get("company-id")?.value
          if (company){
            throw redirect(308, `/home/${cookie.get("company-id")?.value}`)
          }
          throw redirect(308, "/home")
        }else if(pathname.startsWith("/sign")){
          throw redirect(308, "/home")
        }
        sharedMap.set("user", {user_id: user.user_id, user_name: user.user_name})
        return await next()
    }else{
        if(pathname !== "/" && !pathname.startsWith("/sign")){
          throw redirect(308, "/sign")
        }
    }
  }
    if(!pathname.startsWith("/sign") && pathname !== "/"){
      throw redirect(308, "/sign")
    }
}

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useMyCompanys = routeLoader$(async(req)=>{
    const token = req.cookie.get("auth-token")?.value 
    if (token){
        const fetchCompany = await fetch(`${BACKEND_HOST}:5000/api/pro?type=Profile`,{
            headers: [["Authorization", token]]
        })
        return await fetchCompany.json() as {id: string, name: string, adresse: string, postal: number}[]
    }
    return []
})

export const useServerTimeLoader = routeLoader$(async ({sharedMap, cookie}) => {
  const token = cookie.get("auth-token")?.value
  if (token){
      const fetchNotif = await fetch(`${BACKEND_HOST}:5000/api/notif`, {
          headers: [["Authorization", token]]
      })
      if (fetchNotif.status !== 200) {
        return {
          date: new Date().toISOString(),
          user: sharedMap.get("user") as {user_id: string, user_name: string},
          notif: [],
        };
      }
      const notif = await fetchNotif.json() as {id: string, message: string, date: string}[]
      return {
        date: new Date().toISOString(),
        user: sharedMap.get("user") as {user_id: string, user_name: string},
        notif
      };
  }
  return {
    user: sharedMap.get("user") as {user_id: string, user_name: string},
    notif: [],
  };
  
});

export default component$(() => {
  const notif = useServerTimeLoader()
  const companys = useMyCompanys()
  const user = useSignal(notif.value.user || {user_id: "", user_name: ""})
  const onRemoveUser = $((id?: string, name?: string)=>{
    if(id && name){
      user.value = {user_id: id, user_name: name}
    }else{
      user.value = {user_id: "", user_name: ""}
    }
  })
  useContextProvider(userContext, [user, onRemoveUser])
  return (
    <>
      <main>
        <Navbar {...{notif: notif.value.notif, companys: companys.value}}  />
        <div class={"container"}>
          <Slot />
        </div>
      </main>
    </>
  );
});