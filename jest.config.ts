import type { Config } from 'jest';

const pathAliases = {
    components: { pattern: '^@components(.*)$', path: '<rootDir>/src/components$1' },
    hooks: { pattern: '^@hooks(.*)$', path: '<rootDir>/src/hooks$1' },
    images: { pattern: '^@images/(.*)$', path: '<rootDir>/src/images/$1' },
    pages: [
        { pattern: '^@pages$', path: '<rootDir>/src/pages' },
        { pattern: '^@pages/(.*)$', path: '<rootDir>/src/pages/$1' }
    ],
    ui: { pattern: '^@ui/(.*)$', path: '<rootDir>/src/components/ui/$1' },
    api: { pattern: '^@api$', path: '<rootDir>/src/utils/burger-api.ts' },
    utilsTypes: { pattern: '^@utils-types$', path: '<rootDir>/src/utils/types.ts' },
    slices: { pattern: '^@slices/(.*)$', path: '<rootDir>/src/services/slices/$1' },
    selectors: { pattern: '^@selectors/(.*)$', path: '<rootDir>/src/services/selectors/$1' }
};

const generateMappings = () => {
    const mapper: Record<string, string> = {};
    Object.values(pathAliases).forEach(item => {
        if (Array.isArray(item)) {
            item.forEach(({pattern, path}) => {
                mapper[pattern] = path;
            });
        } else {
            mapper[item.pattern] = item.path;
        }
    });
    return mapper;
};

const config: Config = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    moduleNameMapper: generateMappings(),
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
    }
};

export default config;