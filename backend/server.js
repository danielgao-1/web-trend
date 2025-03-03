const express = require('express')
const app = express() // create app to setup express

app.listen(3000) // basic but need ROUTE setup

app.get('/', (req, res) => {
    console.log("Here")
    res.send("Hello")
    
})
