export default {
    testPathIgnorePatterns: ['/node_modules/', '/src/', '/dist/', '/lib/', '/out/', '/bundles/'],
    preset: 'ts-jest/presets/js-with-ts',
    runner: '@kayahr/jest-electron-runner',
    testEnvironment: '@kayahr/jest-electron-runner/environment',
    setupFilesAfterEnv: ['jest-extended/all'],
    globalSetup: '<rootDir>/test/jest-global-setup.ts',
    globalTeardown: '<rootDir>/test/jest-global-teardown.ts',
    transform: {
        '\\.vert$': '@glen/jest-raw-loader',
        '\\.frag$': '@glen/jest-raw-loader',
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                module: 'ESNext',
                esModuleInterop: true,
            },
            diagnostics: false,
        }]
    },
    moduleNameMapper: {
        '^@slot/(.*)$': '<rootDir>/packages/$1/src'
    },
    testMatch: ['**/?(*.)+(spec|tests).[tj]s?(x)'],
    snapshotResolver: '<rootDir>/test/jest-snapshot-resolver.ts',
    collectCoverageFrom: [
        '<rootDir>/packages/**/*.ts',
        '!<rootDir>/packages/**/*.d.ts',
        '!<rootDir>/packages/polyfill/**/*.ts',
    ],
    coverageDirectory: '<rootDir>/dist/coverage',
}