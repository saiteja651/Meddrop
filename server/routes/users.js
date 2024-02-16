// const express=require("express");
// const router=express.Router();
// const middleware = require("../middleware");
// router.post("/cus_up", async (req, res) => {
//     const { name,email,pass } = req.body;
//     let exist=await cus_reg.findOne({email:email})
//     if(exist){
//         res.send("user exist'")
//     }
//     else{
//     await cus_reg.insertOne({ name, email,pass});
//     res.send("data added")
//     }

// });
// router.post("/cus_in",async(req,res)=>{
//     const {email,pass}=req.body;
//     let exist=await cus_reg.findOne({email:email});
//     if(exist){
//         if(pass==exist.pass){
            
//             let payload={
//                 user:{
//                     id:exist.id
//                 }
//             }
//             jwt.sign(payload,'jwtsecret',{expiresIn:360000},(err,token)=>{
//                 if(!err){
//                     return res.json(token)
//                 }
//             })
//         }
//         else{
//             res.send("wrong passowrd");
//         }
//     }
//     else{
//         res.send("user doesnt exist create new account")
//     }
// })
// router.get("/cus_profile",middleware,async(req,res)=>{
//     let exist=await cus_reg.findOne({id:req.id});
//     res.send(exist);
// })
// module.exports=router
var express=require("express")

var router=express.Router()
const{cusSignup}=require("../controllers/clentsignupcontroller");
router.post("/cus_up",cusSignup)
module.exports=router;