/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: ["upload.wikimedia.org", "flagcdn.com"],
	},
}

module.exports = nextConfig
