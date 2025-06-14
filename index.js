const express = require('express')
const server = express();
const mongoose = require('mongoose');
const productRouters = require('./routes/Products')

//middlewares

server.use(express.json())  //to parser req.body
server.use('/products',productRouters.router)
main().catch(err=>console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('database connected')
} 


server.get('/',(req,res)=>{
    res.json({status:'success'})
})

server.listen(8080,()=>{
    console.log(`server is up ${8080}`);
})