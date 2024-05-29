const express = require("express");


const mongoose = require("mongoose");
var jwt = require('jsonwebtoken');

const Admin = require("./Schemas/adminSchema");
const User = require("./Schemas/userSchema");

const app = express();
const port = 3000;

const url ="mongodb+srv://vyshnavthaithottathil:oWWg2g4rzTTfJI1W@cluster0.dnhevwq.mongodb.net/";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// oWWg2g4rzTTfJI1W

// middleware fucncton for authenticaton admin


function verifyToken(req,res,next){
   
  //step to get token from  client     token will be in req.headers
    let authHeader=req.headers.authorization;
    //step to throw error, while no token  in header 
    if(authHeader==undefined){
      res.status(401).send("no token provided")
    }
     
    //step to get only token from authHeader the variable above mentioned ,
    //authHeader will be in the  format of `bearer khsdfvkhsdjkhvckhdskchjsh`(assume it a token)
    //bearer is a industrial standered for passing token from client to server
    //so we are getting a string of bearer token 



    //so we need to access the token only 

    

//step to get token from the string `bearer khsdfvkhsdjkhvckhdskchjsh`(assume it a token)
//we are using the javascript string methode string.split methode  to seperate bearder and token
      let token=authHeader.split(" ")[1]
//when we apply this methode  `bearer khsdfvkhsdjkhvckhdskchjsh`   this will change into   [bearer,token]
//so in order to get token only we need to access the value of 1 st index value
//now the token variable that above mentioned  will be the token that generated when login

      jwt.verify(token,"secret",(err)=>{
        if(err){
          res.send("invalid token")
        }else{
          next()
        }

        //here jwt.verify is the methode provided by jwt library to verify token from client 

        //if it give a suceess result the flow of controll of program passes to next controller function
      })
    


}












// register admin account

app.post("/register",async (req, res) => {
  const admin = new Admin(req.body);
  let body=req.body.username


  try {
    const result = await admin.save();


    //the step to generate a token using jwt   here we give username as payload  
    let token=jwt.sign(body,"secret")
    // console.log(token);
    res.send({auth:true,token:token,result})

    let decoded_token=jwt.decode(token)
    console.log(decoded_token)
    
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
