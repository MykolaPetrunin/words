/** @type {import('next').NextConfig} */
const nextConfig = {
    typedRoutes: true,
    typescript: {
        ignoreBuildErrors: false
    },
    eslint: {
        ignoreDuringBuilds: false
    },
    experimental: {
        optimizePackageImports: ['react', 'react-dom']
    },
    poweredByHeader: false,
    compress: true
};

export default nextConfig;
