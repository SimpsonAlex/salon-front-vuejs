
var history = require('connect-history-api-fallback');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var serveStatic = require('serve-static')

express()
  .use(serveStatic(path.join(__dirname, 'dist'))).use(history())
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))