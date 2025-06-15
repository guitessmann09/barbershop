/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        hostname: "github.com",
      },
      {
        hostname: "yw0ygga3t5.ufs.sh",
      },
    ],
  },
}

export default nextConfig
