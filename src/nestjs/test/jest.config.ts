export default {
  ...require('../jest.config').default,
  displayName: {
    name: 'nestjs-e2e',
    color: 'yellow'
  },
  rootDir: './',
  testRegex: '.*\\.e2e-spec\\.ts$',
  maxWorkers: 1,
  setupFiles: ['<rootDir>/setup-test.ts'],
  moduleNameMapper: {
    '@fm/micro\\-videos/(.*)$': '<rootDir>/../../../node_modules/@fm/micro-videos/dist/$1',
    // '#seedwork/domain': '<rootDir>/../../../node_modules/@fc/micro-videos/dist/@seedwork/domain/index.js',
    '#seedwork/(.*)$': '<rootDir>/../../../node_modules/@fm/micro-videos/dist/@seedwork/$1',
    // '#category/domain': '<rootDir>/../../../node_modules/@fc/micro-videos/dist/category/domain/index.js',
    '#category/(.*)$': '<rootDir>/../../../node_modules/@fm/micro-videos/dist/category/$1',
  },
}
