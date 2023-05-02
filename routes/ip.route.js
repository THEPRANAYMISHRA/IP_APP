const express=require("express")
const ipRouter=express.Router()
const axios=require("axios")
const Redis = require("ioredis");
const configration=require("../redis");
const { SearchModel } = require("../models/searchs.model");
const redisClient = new Redis(configration);

ipRouter.get("/find/:ip",async(req,res)=>{
    const ip=req.params.ip

    let searchCache=await redisClient.get(`${ip}`)

    if(searchCache){
        return res.send(searchCache)
    }else{
        try {
          const response = await axios.get(`https://ipapi.co/${ip}/json/`);

          let data={city:response.data.city,counrty:response.data.country}

        //   await redisClient.set(ip,JSON.stringify(data),"EX",21600)

        let newSearch=new SearchModel({city:response.data.city})

        await newSearch.save()

          res.send(data)

        } catch (error) {
          console.error(error);
        }
    }
})

module.exports=ipRouter