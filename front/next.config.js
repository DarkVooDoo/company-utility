/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                //https://api.dicebear.com/6.x/adventurer/svg?seed=Simba
                hostname: "robohash.org",
                protocol: "https",
                pathname: "**",
                port: ""
            }
        ]
    },
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig
