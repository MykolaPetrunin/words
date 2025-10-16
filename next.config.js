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
    compress: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tvnxr6hgfk2kpio7.public.blob.vercel-storage.com',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
