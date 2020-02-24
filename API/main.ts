const PORT =process.env.PORT||8080
const host="http://localhost:"+PORT;
const PORTengine=process.env.PORTengine||8081
const hostEngine="http://localhost:"+PORTengine;
const urlBdd = process.env.URLbdd||"mongodb://root:pwd@localhost:3307/";
module.exports={"urlBdd":urlBdd,"PORT":PORT,"host":host,"hostEngine":hostEngine}
const app = require('express')()
const express = require('express');
const bodyParser = require('body-parser')
const router = require('./routers/router.ts').router
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./assets'));
app.use('/css',express.static('assets/styles'))
//app.use('/css/style.css',express.static('assets/styles/style.scss'))
app.use('/',router)
app.listen(PORT, () => {
    console.log('Serveur sur port : ', PORT)
})



