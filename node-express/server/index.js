const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()

app.use(bodyparser.json())
app.use(cors())

const port = 8000

let users = []
let counter = 1

let conn = null

//setup server
const initMysql = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tutorials',
        host: 3306
    })
}

const validateData = (userData) => {
    let errors = []

    if(!userData.firstname){
        errors.push('Please Enter Your Firstname')
    }

    if(!userData.lastname){
        errors.push('Please Enter Your Lastname')
    }

    if(!userData.age){
        errors.push('Please Enter Your Age')
    }

    if(!userData.gender){
        errors.push('Please Select Your Gender')
    }

    if(!userData.interests){
        errors.push('Please Select Interest')
    }

    if(!userData.description){
        errors.push('Please Enter Your Description')
    }


    return errors
}


//async awat() promise()

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
POST /users สำหรับการสร้าง users ใหม่
GET /users/:id สำหรับการดีง users รายคนออกมา
PUT /users/:id สำหรับการแก้ไข users รายคน ( ตาม ID ที่บันทึก )
DELETE /users/:id สำหรับการลบ users รายคน ( ตาม ID ที่บันทึก )
*/

//path = get /users
app.get('/users', async(req, res) => {
    const results = await conn.query('SELECT * FROM users')
        res.json(results[0])
    })

//path = POST /users : create users
app.post('/users', async(req,  res) => {

    try {
        let user = req.body

        const errors = validateData(user)
        if(errors.length > 0){
            throw {
                message: 'Please Enter Data',
                errors: errors
            }
        }
        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'insert ok',
            data: results[0]
        })

    } catch (error) {
        const errorMessage = error.message || 'Something wrong'
        const errors = error.errors || []
        console.error('error message', error.message) //deploy
        res.status(500).json({
            message: errorMessage,
            errors: errors
            // errorMessage: error.message //test
        })
    }
})

//get users by id : /users/:id 
app.get('/users/:id', async(req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM users WHERE ID = ?', id)
        // if find id not actually error
        if(results[0].length == 0) {
            throw { statusCode: 404, message: 'Can not find '}
            }
        res.json(results[0][0])
    } catch (error) {
        console.error('error message', error.message) //deploy
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'something wrong',
            errorMessage: error.message //test
        })
    }
})

// path PUT /users/:id : edit data users by id
app.put('/users/:id', async(req, res) => {
    try {
        let id = req.params.id
        let updateUser = req.body
        let user = req.body
        // call query
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id])
        res.json({
            message: 'update ok',
            data: results[0] //results update
        })
    } catch (error) {
        error('error message', error.message) //deploy
        res.status(500).json({
            message: 'something wrong',
            // errorMessage: error.message //test
        })
    }
})

//path delete /users/:id : delete users/id
app.delete('/users/:id', async(req, res) => {
    try {
        let id = req.params.id
        // call query
        const results = await conn.query('DELETE FROM users WHERE id = ?', id)
        res.json({
            message: 'delete ok',
            data: results[0] //results update
        })
    } catch (error) {
        error('error message', error.message) //deploy
        res.status(500).json({
            message: 'something wrong',
            // errorMessage: error.message //test
        })
    }
})

//start the server
app.listen(port, async (req, res) => {
    await initMysql()
    console.log('http server run at: ' + port);
})

