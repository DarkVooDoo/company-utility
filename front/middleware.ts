import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
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
                return NextResponse.redirect(new URL("/", request.url))
            }
            const res = NextResponse.next()
            res.cookies.set("id", user.user_id)
            res.cookies.set("lastname", user.user_lastname)
            return res
        }
    }else{
        return NextResponse.redirect(new URL("/sign", request.url))
    }
    
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/shift/:path*', "/profile/:path*"],
}