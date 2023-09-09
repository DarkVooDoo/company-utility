import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest)=>{
    const token = request.cookies.get("auth-token")
    if(token){
        const authorize = await fetch(`http://localhost:5000/api/auth`, {
            headers: [["Authorization", token.value]]
        })
        if(authorize.status === 200){
            const user = await authorize.json()
            if(request.nextUrl.pathname.startsWith("/sign")){
                return NextResponse.redirect(new URL("/home", request.url))
            }else if(request.nextUrl.pathname === "/"){
                const company = request.cookies.get("company-id")?.value
                if (company){
                    return NextResponse.redirect(new URL(`/home/${request.cookies.get("company-id")?.value}`, request.url))
                }
                return NextResponse.redirect(new URL("/home", request.url))
            }
            const res = NextResponse.next()
            res.cookies.set("id", user.user_id)
            // res.cookies.set("user_name", user.user_name)
            return res
        }else{
            if(request.nextUrl.pathname.startsWith("/home")){
                return NextResponse.redirect(new URL("/sign", request.url))
            }else{
                return NextResponse.redirect(new URL("/sign", request.url))
            }
        }
    }
    if(!request.nextUrl.pathname.startsWith("/sign") && !request.nextUrl.pathname.startsWith("/")){
        console.log(request.nextUrl.pathname)
        return NextResponse.redirect(new URL("/sign", request.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/shift/:path*', "/profile/:path*", "/home/:path*", "/sign", "/dashboard/:path*"],
}