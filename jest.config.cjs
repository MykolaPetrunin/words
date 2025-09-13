/** @type {import('jest').Config} */
const config = {
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
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/__tests__/**', '!src/**/*.test.{ts,tsx}', '!src/**/*.spec.{ts,tsx}'],
    coveragePathIgnorePatterns: [
        'src/app/layout.tsx',
        'src/app/globals.css',
        'src/lib/redux/ReduxProvider.tsx',
        'src/components/ui/',
        'src/app/page.tsx',
        'src/app/objects/page.tsx',
        'src/components/theme/',
        'src/lib/theme/'
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    }
};

module.exports = config;
