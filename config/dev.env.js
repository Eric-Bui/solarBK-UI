'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  APIURL: '"http://localhost:5000/swhapi"',
  PVSOFA: '"http://localhost:5000/pvsofarapi"',
  HOST: '"http://localhost:8080"',
  CLIENT_ID: 2,
  CLIENT_TOKEN: '"LolMPgWFZcmVq0edNmeiCBghVqETp2XdwYMXiUnJ40dMgLKit76o857SOBmOjnKt"',
  SCOPE: '"read_profile"',
  GRANT_TYPE: '"authorization_code"',
  OAUTH2_URL: '"https://icms.solarbk.vn/oauth2"'
})
