export default {
  displayName: {
    name: 'nestjs',
    color: 'magentaBright',
  },
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "src",
  testRegex: [".*\\..*spec\\.ts$",
    ".*\\..*int-spec\\.ts$",
    ".*\\..*e2e-spec\\.ts$",
    ".*\\..*ispec\\.ts$"
  ],
  transform: {
    "^.+\\.(t|j)s$": "@swc/jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageProvider: "v8",
  coverageDirectory: "../__coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    '@fm/micro\\-videos/(.*)$': '<rootDir>/../../../node_modules/@fm/micro-videos/dist/$1',
    // '#seedwork/domain': '<rootDir>/../../../node_modules/@fc/micro-videos/dist/@seedwork/domain/index.js',
    '#seedwork/(.*)$': '<rootDir>/../../../node_modules/@fm/micro-videos/dist/@seedwork/$1',
    // '#category/domain': '<rootDir>/../../../node_modules/@fc/micro-videos/dist/category/domain/index.js',
    '#category/(.*)$': '<rootDir>/../../../node_modules/@fm/micro-videos/dist/category/$1',
  },
  setupFilesAfterEnv: [
    "../../@core/src/@seedwork/domain/tests/jest.ts"
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    },
  }
}