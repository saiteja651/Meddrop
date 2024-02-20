const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const app = express();
const bodyparser=require("body-parser")
const http=require("http")

const { MongoClient, ObjectId } = require("mongodb");
const middleware = require("./middleware");
const razorpay=require("razorpay")

const crypto=require("crypto")
require("dotenv").config();

const { Server } = require("socket.io");
app.use(cors());
const path=require("path")
app.use(express.static(path.join(__dirname,"public")))
const server = http.createServer(app);
const sendMail = require("./Mail");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    // console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    // console.log("User Disconnected", socket.id);
  });
});

// io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);
  
//     socket.on("join_room", (data) => {
//       socket.join(data);
//       console.log(`User with ID: ${socket.id} joined room: ${data}`);
//     });
  
//     socket.on("send_message", (data) => {
//       socket.to(data.room).emit("receive_message", data);
//     });
  
//     socket.on("disconnect", () => {
//       console.log("User Disconnected", socket.id);
//     });
//   });
  

app.use(cors());
app.use(bodyparser.json())
app.use(express.json());

server.listen("5000", (req, res) => {
    console.log("Hello world")
})
app.get("/", (req, res) => {
    res.send("hello world");
})
// io.on("connection",(socket)=>{
//     console.log("Connected....")
// })
const url =
    "mongodb+srv://admin:Saiteja123.@cluster0.friabbo.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(url, { useUnifiedTopology: true }, { useNewUrlParser: true }, { connectTimeoutMS: 300000 }, { keepAlive: 1 });
client.connect();
const nodemailer=require("nodemailer")
const db = client.db("Miniproject");
const cus_reg = db.collection("cus_reg");
const doc_reg = db.collection("doc_reg");
const customer_requests = db.collection("customer_requests")
const design_schedule=db.collection("design_schedule")
const client_appointments=db.collection("client_appointment");
const doctor_appointments=db.collection("doctor_appointment");
const compl_client_appointments=db.collection('compl_client_appointments');
const compl_doctor_appointments=db.collection("compl_doctor_appointments");
const payments=db.collection("payments")
const doctor_reviews=db.collection("doctor_reviews");
const userRouter=require("./routes/users")
const chat_id=db.collection("chat_id")

app.post("/cus_up", async (req, res) => {
    const { name, email, pass,photo} = req.body;
    let exist = await cus_reg.findOne({ email: email })
    if (exist) {
        res.send("user exist")
    }
    else {
        await cus_reg.insertOne({ name, email, pass,photo });
        res.send("data added")
    }

});
app.post("/cus_in", async (req, res) => {
    const { email, pass } = req.body;
    let exist = await cus_reg.findOne({ email: email });
    if (exist) {
        if (pass === exist.pass) {

           let payload = {
                user: {
                    id: exist._id
                }
            }
            jwt.sign(payload, '1234-5678', (err, token) => {
                if (!err) {
                    sendMail("Authentication","saitejakandadi7@gmail.com","successfully logged in")
                    return res.json(token)
                }
            })
        }
        else {
            res.send("wrong password");
        }
    }
    else {
        res.send("user doesnt exist create new account")
    }
})
app.get("/cus_profile", middleware, async (req, res) => {
    try {
        let exist = await cus_reg.findOne({_id :new ObjectId(req.user.id)});
        if (exist) {
            res.status(200).send(exist);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
    
        // console.error("Error fetching customer profile:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/customer_requests", middleware, async (req, res) => {
    try{
        const { specialization, date, description } = req.body;
    await customer_requests.insertOne({ specialization, date, description })
    res.send("request received")
    }
    catch(error){
        console.log(error)
        res.status(5000).send("Internal Server Error")
    }
    
})
app.get("/client_appointments",middleware,async(req,res)=>{
    
    console.log(req.user.id)
   let exist = await client_appointments.find({client_id:new ObjectId(req.user.id)}).toArray();
   console.log("exist",exist)
   res.status(200).send(exist)
})






app.post("/doc_signup", async (req, res) => {
    
        const { name, email, pass, photo, specialization } = req.body;
        
        // Check if the user already exists
        const exist = await doc_reg.findOne({ email: email });
        if (exist) {
            res.status(409).send("user exists");
        } else {
            // Insert the user data into the database
            await doc_reg.insertOne({ name, email, pass, photo, specialization });
            res.status(200).send("data added");
        }

    
});

app.post("/doc_login", async (req, res) => {
    const { email, pass } = req.body;
    let exist = await doc_reg.findOne({ email: email });
    if (exist) {
        if (pass == exist.pass) {

           let payload = {
                user: {
                    id: exist._id
                }
            }
            jwt.sign(payload, '1234-5678', (err, token) => {
                if (!err) {
                    return res.json(token)
                }
            })
        }
        else {
            res.send("wrong password");
        }
    }
    else {
        res.send("user doesnt exist create new account")
    }
})


app.get("/doctor_profile", middleware, async (req, res) => {
    try{
    let exist = await doc_reg.findOne({_id:new ObjectId(req.user.id) });
    if(exist){
    res.status(200).send(exist);
    }
    else{
        res.status(404).send("User not found")
    }
}
catch(err){
    res.status(500).send("Internal Server Error")
}
})
app.post("/design_schedule",middleware,async(req,res)=>{
   
    try{
    const {date,freehours}=req.body;
    await design_schedule.insertOne({date,freehours,doctor_id:new ObjectId(req.user.id)})
    res.send("data added")
    }
    catch(err){
        res.status(500).send("Internal Server Error")
}
})
app.get("/get_schedule",middleware,async(req,res)=>{
    try{
        let exist=await design_schedule.find({doctor_id:new ObjectId(req.user.id)}).toArray();
    res.send(exist)
    }
    catch(err){
        res.status(500).send("Internal Server Error")
    }
    
})
app.post("/del_schedule",middleware,async(req,res)=>{
    try{
        const {_id}=req.body
        await design_schedule.findOneAndDelete({_id:new ObjectId(_id)});
        res.send("record deleted")
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
   
})
app.post("/find_doctors", middleware, async (req, res) => {
    // const { spec } = req.body;
    // let exist = await doc_reg.find({specialization:spec}).toArray();
    const {date,spec}=req.body
    const postsWithAuthors = await design_schedule.aggregate([
        {
          $lookup: {
            from: 'doc_reg',
            localField: 'doctor_id',
            foreignField: '_id',
            as: 'result'
          }
        },
       
        {
            $match:{
                date:date,
                "result.specialization":spec
            }
        },
    
    ]).toArray();
   
    
     
   await res.send(postsWithAuthors)
})
app.post("/my_appointments",middleware,async(req,res)=>{
    const{date,time,doctor,photo,doctor_id,ele_id}=req.body;
    const client_id=req.user.id;
    await doctor_appointments.insertOne({date:date,time:time,client_id:new ObjectId(client_id),doctor_id:new ObjectId(doctor_id)})
    await client_appointments.insertOne({date,time,doctor,photo,doctor_id:new ObjectId(doctor_id),client_id:new ObjectId(client_id)})
    let exist=await design_schedule.findOneAndDelete({_id:new ObjectId(ele_id)});
    await chat_id.insertOne({doctor_id:new ObjectId(doctor_id),client_id:new ObjectId(client_id)})
    sendMail("Booking Status","saitejakandadi7@gmail.com",`appoitment booked with doctor ${doctor}`)
    res.send(exist)
})

app.get("/doctor_appointments",middleware,async(req,res)=>{
    const postsWithAuthors = await doctor_appointments.aggregate([
        {
          $lookup: {
            from: 'cus_reg',
            localField: 'client_id',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
            $match:{
                doctor_id:new ObjectId(req.user.id),
            }
        }
    ]).toArray();
    
    res.send(postsWithAuthors)
})
app.post("/treated",middleware,async(req,res)=>{
    const{id}=req.body;
    let exist=await doctor_appointments.findOne({_id:new ObjectId(id)})
    await compl_client_appointments.insertOne(exist);
    await compl_doctor_appointments.insertOne(exist)
    await client_appointments.findOneAndDelete({date:exist.date,time:exist.time})
    await doctor_appointments.findOneAndDelete({_id:new ObjectId(id)})

})
app.get("/client_past_app",middleware,async(req,res)=>{
    const postsWithAuthors = await compl_client_appointments.aggregate([
        {
          $lookup: {
            from: 'doc_reg',
            localField: 'doctor_id',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
            $match:{
                client_id:new ObjectId(req.user.id),
            }
        }
    ]).toArray();
    res.send(postsWithAuthors)
   
})

app.get("/doctor_past_app",middleware,async(req,res)=>{
    const postsWithAuthors = await compl_client_appointments.aggregate([
        {
          $lookup: {
            from: 'doc_reg',
            localField: 'doctor_id',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
            $match:{
                client_id:new ObjectId(req.user.id),
            }
        }
    ]).toArray();
    res.send(postsWithAuthors)
})
app.post("/doctor_reviews",middleware,async(req,res)=>{
    const {description,reviewed_record,rating,doctor_id}=req.body;
    await doctor_reviews.insertOne({reviewed_record,client_id:new ObjectId(req.user.id),rating,description,doctor_id:new ObjectId(doctor_id)});
    let exist = await doctor_reviews.find({doctor_id:new ObjectId(doctor_id)},{projection:{rating:1,_id:0}}).toArray();
    function calculateAvgRating(ratings) {
        if (ratings.length === 0) return 0; // Return 0 if no ratings
        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0); // Sum of all ratings
        return sum / ratings.length; // Average rating
      } 
      // Calculate the average rating
    const avgRating = calculateAvgRating(exist);
    await doc_reg.findOneAndUpdate({_id:new ObjectId(doctor_id)},{$set:{rating:avgRating.toFixed(2)}})
    res.send("data added");
})
app.get("/doctor_review",middleware,async(req,res)=>{
    let exist = await doctor_reviews.find({}, { projection: { reviewed_record: 1, _id: 0 } }).toArray();
    const reviewedRecords = exist.map(item => item.reviewed_record);
    res.send(reviewedRecords)
})
app.get("/for_doctors_reviews",middleware,async(req,res)=>{
    const postsWithAuthors = await doctor_reviews.aggregate([
        {
          $lookup: {
            from: 'cus_reg',
            localField: 'client_id',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
            $match:{
                doctor_id:new ObjectId(req.user.id),
            }
        }
    ]).toArray();
    res.send(postsWithAuthors)
})  
app.get("/doctor_rating_avg",middleware,async(req,res)=>{
    let exist = await doctor_reviews.find({doctor_id:new ObjectId(req.user.id)},{projection:{rating:1,_id:0}}).toArray();
    await res.send(exist)
})

app.post("/doctor_rating_avg",middleware,async(req,res)=>{
    const {doctor_id}=req.body
    let exist = await doctor_reviews.find({doctor_id:new ObjectId(doctor_id)},{projection:{rating:1,_id:0}}).toArray();
    
    res.send(exist)
})

const  dotenv =require("dotenv");
dotenv.config();
const Razorpay = require("razorpay");
const exp = require("constants");

app.use(express.urlencoded({extended:true}));
app.post("/payments/orders",middleware, async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.kEY,
			key_secret: process.env.SECRET,
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

app.post("/payments/verify", middleware,async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign =crypto.createHmac('sha256',process.env.SECRET).update(sign.toString()).digest('hex')
		if (razorpay_signature === expectedSign) {
            await payments.insertOne({
                razorpay_order_id,razorpay_payment_id,razorpay_signature,client_id:new ObjectId(req.user.id)
            })
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});


app.get("/client_chat",middleware,async(req,res)=>{
    const postsWithAuthors = await chat_id.aggregate([
        {
          $lookup: {
            from: 'doc_reg',
            localField: 'doctor_id',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
            $match:{
                client_id:new ObjectId(req.user.id),
            }
        }
    ]).toArray();
    res.send(postsWithAuthors)
})

app.get("/doctor_chat",middleware,async(req,res)=>{
    const postsWithAuthors = await chat_id.aggregate([
        {
          $lookup: {
            from: 'cus_reg',
            localField: 'client_id',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
            $match:{
                doctor_id:new ObjectId(req.user.id),
            }
        }
    ]).toArray();
    res.send(postsWithAuthors)
})
app.post("/block_user",middleware,async(req,res)=>{
    const client_id=req.body.id;
    await chat_id.deleteMany({client_id:new ObjectId(client_id),doctor_id:new ObjectId(req.user.id)})
    res.send("blocked succesfully")
})
app.get("/comp_doctor_app",middleware,async(req,res)=>{
    const postsWithAuthors = await compl_doctor_appointments.aggregate([
        {
          $lookup: {
            from: 'cus_reg',
            localField: 'client_id',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
            $match:{
                doctor_id:new ObjectId(req.user.id),
            }
        }
    ]).toArray();
    res.send(postsWithAuthors)
   
})

app.use((req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})
module.exports={app,doc_reg,jwt,cus_reg,customer_requests,client_appointments,design_schedule,doctor_appointments,compl_client_appointments
,doctor_reviews}