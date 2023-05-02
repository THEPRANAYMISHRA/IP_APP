const express=require("express")
const Redis = require("ioredis");
const configration=require("./redis");
const { connection } = require("./db")
const app=express()
app.use(express.json())
var cookieParser = require('cookie-parser')
const userRouter = require("./routes/user.route");
const ipRouter = require("./routes/ip.route");
const auth = require("./middleware/auth");
app.use(cookieParser())


app.get('/',(req,res)=>{
    res.send("hello world")
})

app.use("/user",userRouter)
app.use("/details",auth,ipRouter)

app.listen(6500,async()=>{
    try {
        await connection
        console.log("Connected to DB!")
    } catch (error) {
        console.log("DB connection failed!")
    }
    console.log("listening on port 6500!")
})