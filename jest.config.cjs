/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react-jsx',
                    esModuleInterop: true
                }
            }
        ]
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^react-markdown$': '<rootDir>/__mocks__/react-markdown.tsx',
        '^remark-gfm$': '<rootDir>/__mocks__/remark-gfm.ts',
        '^rehype-highlight$': '<rootDir>/__mocks__/rehype-highlight.ts',
        '^rehype-raw$': '<rootDir>/__mocks__/rehype-raw.ts',
        '^rehype-sanitize$': '<rootDir>/__mocks__/rehype-sanitize.ts',
        '^remark-breaks$': '<rootDir>/__mocks__/remark-breaks.ts'
    },
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    transformIgnorePatterns: ['node_modules/(?!(rehype-highlight|rehype-raw|rehype-sanitize|remark-breaks)/)'],
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
    coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};

module.exports = config;
