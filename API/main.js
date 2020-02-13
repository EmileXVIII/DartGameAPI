var PORT = process.env.PORT || 8080;
var host = "localhost:" + PORT;
var urlBdd = "mongodb://root:pwd@localhost:3306/";
module.exports = { "urlBdd": urlBdd, "PORT": PORT, "host": host };
var app = require('express')();
var bodyParser = require('body-parser');
var router = require('./router/router.ts').router;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.listen(PORT, function () {
    console.log('Serveur sur port : ', PORT);
});
