import Link from "next/link"

const NoFound = ()=>{
    return (
        <main>
            <h1>Error 404 Not Found</h1>
            <Link href={"/"}>Accuille</Link>
        </main>
    )
}

export default NoFound