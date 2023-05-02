require("dotenv").config();

const configration={
    port:12797,
    host:"redis-12797.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    username: "default",
    password:process.env.password
}

module.exports=configration