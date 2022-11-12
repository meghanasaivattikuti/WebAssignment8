require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true} )

const db=mongoose.connection

db.on('error',(error) => console.error(error))
db.once('open',() => console.log('Connected to database'))
app.use(express.json())
const routeuser=require('./routes/users')
app.use('/users',routeuser)
app.listen(3000, () => console.log("Server has started"))




