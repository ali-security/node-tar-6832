// separate file so I stop getting nagged in vim about deprecated API.
function umask () { return process.umask() }
module.exports = umask
