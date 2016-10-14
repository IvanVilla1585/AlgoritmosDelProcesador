var http = require('http')
var fs = require('fs')
const express = require('express')

const app = express()
const server = http.createServer(app)

app.use(express.static('./public'))

function serverStatic(name, callback) {
  fs.readFile('./public' + name, function (err, data) {
    if (err) return callback(err)

    callback(err, data.toString())
  })
}

/*var server = http.createServer(function (req, res) {
  console.log('recibi un request de ' + req.url)
  var vec = req.url.split(".")
  if (vec.length == 1){
    serverStatic('/index.html', function (err, content) {
      res.end(content)
    })
  }else if (vec.length == 2) {
    serverStatic(vec[0] + '.' +  vec[1], function (err, content) {
      res.end(content)
    })
  }else {
    res.statusCode = 404
    res.end('Recurso no escontrado')
  }
})*/

server.listen(3000, function () {
  console.log('corriendo en el puerto 3000')
})
