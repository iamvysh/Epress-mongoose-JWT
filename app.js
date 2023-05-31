const express = require("express");
const midile = require('./Schemas/adminSchema')

const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');

const Admin = require("./Schemas/adminSchema");
const User = require("./Schemas/userSchema");

const app = express();
const port = 3000;

const url =
  "mongodb+srv://vyshnavthaithottathil:0x7Ni0QJc12JuABS@cluster0.bhnvti1.mongodb.net/dbname";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// middleware fucncton for authenticaton admin


function verifyToken(req,res,next){

    let authHeader=req.headers.authorization;
    if(authHeader==undefined){
      res.status(401).send("no token provided")
    }
      let token=authHeader.split(" ")[1]
      jwt.verify(token,"secret",(err)=>{
        if(err){
          res.send("invalid token")
        }else{
          next()
        }
      })
    


}












// register admin account

app.post("/register",async (req, res) => {
  const admin = new Admin(req.body);
  let body=req.body


  try {
    const result = await admin.save();
    let token=jwt.sign(body,"secret")
    console.log(token);
    res.send({auth:true,token:token,result})
    
  } catch (err) {
    console.log("err", err);
  }





});


// login admin account


app.post("/login",verifyToken,(req,res)=>{

  try{
    const admin = new Admin(req.body);
    res.send("Admin loggined successfully")
    
  }catch(err)
  {
    console.log("error",err)
  }



})






// create user with name,email,username

app.post("/users", async (req, res) => {
  const users = new User(req.body);
  try {
    let result = await users.save();
    res.json(result);
  } catch (err) {
    console.log("error", err);
  }
});

// get all users

app.get("/users", verifyToken,async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log("error", err);
  }
});

// get a user with id

app.get("/users/:id", verifyToken,async (req, res) => {
  try {
    const result = await User.findById(req.params.id);
    res.json(result);
  } catch (err) {
    console.log("error", err);
  }
});

// get user by id and update

app.put("/users/:id",verifyToken, async (req, res) => {
  let id = req.params.id;
  let {content} = req.body;
  try {
    const result = await User.findByIdAndUpdate(id, content);
    res.send(result);
  } catch (err) {
    console.log("error", err);
  }
});

//get uset by id and delete

app.delete("/users/:id",verifyToken, async (req, res) => {
  let ID = req.params.id;
  try {
    let result = await User.findByIdAndRemove(ID);
    res.json("ok");
  } catch (err) {
    console.log("error", err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose
  .connect(url)
  .then(() => console.log("Db connected"))
  .catch((error) => console.log("error occured", error));
