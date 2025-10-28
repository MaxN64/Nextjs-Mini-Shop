/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "console.firebase.google.com",
      "upload.wikimedia.org",
      "ecommerce-sepidev.vercel.app/",
    ],
  },
};

module.exports = nextConfig;
