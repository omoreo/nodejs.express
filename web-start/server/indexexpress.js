//call expressjs
const express = require("express")
const app = express() 

const port = 8000 //set port

//set route
app.get('/test', (req, res) => {
    //class
    let user = {
        firstname: 'firstname',
        lastname: 'lastname',
        age: 20
    }
    res.json(user) //json parse
})
// terminal response
app.listen(port, (req, res) => {
    console.log("http server run at: "+ port);
})