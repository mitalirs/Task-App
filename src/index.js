const express = require('express')
require("./db/mongoose") //ensures running of this mongoose file which in turn ensures connecting of mongoose to database with those 3 lines 
const User = require("./models/user") 

const Task = require("./models/task")
const { findByIdAndDelete } = require('./models/user')

const app = express()
const port = process.env.PORT


app.use(express.json()) //configuring express to parse the incoming json so we can access it like an obj(req DOT BODY //req.body)


const userRouter = require('./routers/user') //this cannot come before app ka initialisation
app.use(userRouter) 

const taskRouter = require('./routers/task')
app.use(taskRouter)


app.listen(port, (req, res)=>{
    console.log('server is up on port ' + port)
})


