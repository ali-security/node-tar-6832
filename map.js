const {basename} = require('path')

const map = test =>
  test === 'index.js' || test === 'map.js' ? test
  : test === 'ghsa-r6q2-hw4h-h46w.js' ? ['lib/normalize-unicode.js', 'lib/extract.js', 'lib/header.js']
  : test === 'unpack.js' ? ['lib/unpack.js', 'lib/mkdir.js', 'lib/normalize-unicode.js']
  : test === 'load-all.js' ? []
  : `lib/${test}`

module.exports = test => map(basename(test))
