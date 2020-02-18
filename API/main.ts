const PORT =process.env.PORT||8080
const host="localhost:"+PORT;
const urlBdd = "mongodb://root:pwd@localhost:3306/";
module.exports={"urlBdd":urlBdd,"PORT":PORT,"host":host}
const app = require('express')()
const express = require('express');
const bodyParser = require('body-parser')
const router = require('./router/router.ts').router
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./assets'));
app.use('/css',express.static('assets/styles'))
//app.use('/css/style.css',express.static('assets/styles/style.scss'))
app.use('/',router)
app.listen(PORT, () => {
    console.log('Serveur sur port : ', PORT)
})



