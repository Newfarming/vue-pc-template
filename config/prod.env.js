'use strict'
const gitSha = require('child_process').execSync('git rev-parse HEAD').toString().trim();
process.env.RELEASE_VERSION = gitSha
console.log('RELEASE_VERSION:',gitSha);
module.exports = {
  RELEASE_VERSION: `"${gitSha}"`,
  NODE_ENV: '"production"'
}
