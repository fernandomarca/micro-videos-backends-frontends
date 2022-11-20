#!/bon/sh

npm run cti creat './src/@seedwork/application' -- -i '*spec.ts' -b &&
npm run cti creat './src/@seedwork/domain' -- -i '*spec.ts' -b &&
npm run cti creat './src/@seedwork/infra' -- -i '*spec.ts' -b &&

npm run cti creat './src/category/application' -- -i '*spec.ts' -b &&
npm run cti creat './src/category/domain' -- -i '*spec.ts' -b &&
npm run cti creat './src/category/infra' -- -i '*spec.ts' -b 