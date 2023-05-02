const jwt=require("jsonwebtoken");
const Redis = require("ioredis");
const configration=require("../redis");
const redisClient = new Redis(configration);

const auth=async(req,res,next)=>{
    const email=req.cookies.email
    const token= await redisClient.get(`${email}access_token`)
    const black_access_token= await redisClient.get(`${email}black_access_token`)
    if(token){
        if(black_access_token==token){
            return res.send({"msg":"Unauthorized token,please login again!"})
        }else{
            var decoded = await jwt.verify(token, 'Pranay');
            if(decoded){
                req.body.email=decoded.email
                next()
            }else{
                return res.send({"msg":"unauthorized token"})
            }
        }
    }else{
        return res.send({"msg":"please login first!"})
    }
}

module.exports=auth