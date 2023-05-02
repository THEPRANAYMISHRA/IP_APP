const mongoose=require("mongoose")

const citySchema=mongoose.Schema({
    email: {type: String},
    city:{type: String}
})

const SearchModel=mongoose.model("search",citySchema)

module.exports={SearchModel}