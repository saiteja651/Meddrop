const express=require("express")
const { MongoClient, ObjectId } = require("mongodb");
const url =
    "mongodb+srv://admin:Saiteja123.@cluster0.friabbo.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(url, { useUnifiedTopology: true }, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });
const db = client.db("Miniproject");

const cus_reg = db.collection("cus_reg");

const cusSignup = async(req, res) =>{

    const { name, email, pass,photo} = req.body;
    let exist = await cus_reg.findOne({ email: email })
    console.log(exist)
    if (exist) {
        res.send("user exist")
    }
    else {
        await cus_reg.insertOne({ name, email, pass,photo });
        res.send("data added")
    }
}


module.exports = {cusSignup}