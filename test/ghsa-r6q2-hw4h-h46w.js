'use strict'

const t = require('tap')
const path = require('path')
const fs = require('fs')

const extract = require('../lib/extract.js')
const Header = require('../lib/header.js')
const normalizeUnicode = require('../lib/normalize-unicode.js')

// these characters are problems on macOS's APFS
const chars = {
  ['ﬀ'.normalize('NFC')]: 'FF',
  ['ﬁ'.normalize('NFC')]: 'FI',
  ['ﬂ'.normalize('NFC')]: 'FL',
  ['ﬃ'.normalize('NFC')]: 'FFI',
  ['ﬄ'.normalize('NFC')]: 'FFL',
  ['ﬅ'.normalize('NFC')]: 'ST',
  ['ﬆ'.normalize('NFC')]: 'ST',
  ['ẛ'.normalize('NFC')]: 'Ṡ',
  ['ß'.normalize('NFC')]: 'SS',
  ['ẞ'.normalize('NFC')]: 'SS',
  ['ſ'.normalize('NFC')]: 'S',
}

for (const [c, n] of Object.entries(chars)) {
  t.test(`${c} => ${n}`, async t => {
    t.equal(normalizeUnicode(c), n)

    t.test('link then file', async t => {
      const tarball = Buffer.alloc(2048)
      new Header({
        path: c,
        type: 'SymbolicLink',
        linkpath: './target',
      }).encode(tarball, 0)
      new Header({
        path: n,
        type: 'File',
        size: 1,
      }).encode(tarball, 512)
      tarball[1024] = 'x'.charCodeAt(0)

      const cwd = t.testdir({ tarball })

      await extract({ cwd, file: path.resolve(cwd, 'tarball') })

      t.throws(() => fs.statSync(path.resolve(cwd, 'target')))
      t.equal(fs.readFileSync(path.resolve(cwd, n), 'utf8'), 'x')
    })

    t.test('file then link', async t => {
      const tarball = Buffer.alloc(2048)
      new Header({
        path: n,
        type: 'File',
        size: 1,
      }).encode(tarball, 0)
      tarball[512] = 'x'.charCodeAt(0)
      new Header({
        path: c,
        type: 'SymbolicLink',
        linkpath: './target',
      }).encode(tarball, 1024)

      const cwd = t.testdir({ tarball })

      await extract({ cwd, file: path.resolve(cwd, 'tarball') })

      t.throws(() => fs.statSync(path.resolve(cwd, 'target')))
      t.equal(fs.lstatSync(path.resolve(cwd, c)).isSymbolicLink(), true)
    })
  })
}
