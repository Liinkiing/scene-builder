let express = require('express');
let path = require('path');
let serveStatic = require('serve-static');
app = express();
app.use(serveStatic(__dirname + "/dist", {
  maxAge: '1d'
}));
let port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);
