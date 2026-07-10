const fs = require('fs')
const path = require('path')
const out = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(out)) process.exit(0)

fs.writeFileSync(path.join(out, '.nojekyll'), '')
fs.writeFileSync(path.join(out, 'CNAME'), 'kniff.world')
console.log('Wrote .nojekyll and CNAME to dist/')
