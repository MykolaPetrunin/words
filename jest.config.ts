import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coveragePathIgnorePatterns: ['src/app/layout.tsx', 'src/app/globals.css', 'src/lib/redux/ReduxProvider.tsx']
};

export default config;

