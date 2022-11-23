/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    service: 'http://localhost:3000/api/imagen',
    default:'undefined',
    format:'jpeg',
    maxImageSize:5242880,
    imageQuality:100,
  },
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig
