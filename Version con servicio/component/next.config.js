/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    service: 'http://localhost:3001/imagen/',
    default:'undefined',
    format:'jpeg',
    maxImageSize:5242880,
    imageQuality:100,
    status:false,
  },
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig
