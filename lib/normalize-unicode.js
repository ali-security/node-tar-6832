'use strict'

const normalizeCache = Object.create(null)
const { hasOwnProperty } = Object.prototype
module.exports = s => {
  if (!hasOwnProperty.call(normalizeCache, s)) {
    normalizeCache[s] = s
      .normalize('NFD')
      .toLocaleLowerCase('en')
      .toLocaleUpperCase('en')
  }
  return normalizeCache[s]
}
