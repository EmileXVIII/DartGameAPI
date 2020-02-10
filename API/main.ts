const app = require('express')()
const router = require('./router/router.ts').router
const PORT =process.env.PORT||8080
const host="localhost:"+PORT;
app.use('/',router)
app.listen(PORT, () => {
    console.log('Serveur sur port : ', PORT)
})


