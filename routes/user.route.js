const express=require("express")
const userRouter=express.Router();
const bcrypt=require("bcrypt");
const { UserModel } = require("../models/user.model");
const jwt=require("jsonwebtoken");
const Redis = require("ioredis");
const configration=require("../redis");
const auth = require("../middleware/auth");
const redisClient = new Redis(configration);

userRouter.post("/signup",async(req,res)=>{
    const {name,email,password}=req.body
    const user=await UserModel.findOne({email:email})
    if(user){
        return res.send({"msg":"user already present!"})
    }
    try {
        bcrypt.hash(password,5,async(err, hash)=>{
            if(err){
                res.send("Error occured")
                console.log(err.message)
            }else{
                const user=new UserModel({name,email,password:hash})
                await user.save()
                res.send({"msg":"signup successful!"})
            }
        });
    } catch (error) {
        res.send("Error occured")
        console.log(error.message)
    }
    // res.send(req.body)

})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user=await UserModel.findOne({email:email})

    if(!user){
        res.send({"msg":"no such user,please signup!"})
   }
    if(user){
        bcrypt.compare(password,user.password,async(err, result)=>{
            if(err){
                return res.send({"msg":"login failed!"})
            }else{
                try {
                    const token= await jwt.sign({email:email},"Pranay")
                    await redisClient.set(`${email}access_token`,token);
                    req.headers.authorization.token=token
                    res.cookie("email",email)
                    res.send({"msg":"login successful!"})
                } catch (error) {
                    console.log(error.message)
                    res.send({"msg":"error occured"})
                }
            }
        });        
    }
})

userRouter.get("/logout",async(req,res)=>{
    const email=req.cookies.email

    const token=await redisClient.get(`${email}access_token`);

    try {
        await redisClient.set(`${email}black_access_token`,token);
        res.send({"msg":"logout successful!"})
    } catch (error) {
        res.send({"msg":"logout error"})
    }
})

module.exports=userRouter