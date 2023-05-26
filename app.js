


const express = require('express')

const mongoose = require('mongoose');


const Admin = require('./Schemas/adminSchema');
const User=require('./Schemas/userSchema');


const app = express()
const port = 3000


const url="mongodb+srv://vyshnavthaithottathil:0x7Ni0QJc12JuABS@cluster0.bhnvti1.mongodb.net/dbname"

app.use(express.urlencoded({extended:true}))
app.use(express.json())



// register admin account

app.post("/register",async (req,res)=>{

          const admin=new Admin(req.body)

          try{
            const result=await admin.save()
            res.json(result)
          }
          catch(err){
            console.log("err",err);
          }


})



// create user with name,email,username



app.post("/users",async(req,res)=>{
  const users=new User(req.body)
  try{
        let result=await users.save()
        res.json(result)
  }
  catch(err)
  {
    console.log("error",err)
  }
})



// get all users


app.get('/users', async(req, res) => {

      try{
        const users= await  User.find()
        res.status(200).json(users)
      }catch(err){
        console.log("error",err)
        
      }

  
})

// get a user with id


app.get('/users/:id',async (req,res)=>{

        try{
              const result=await  User.findById(req.params.id)
              res.json(result)
        }
        catch(err){
          console.log("error",err)
        }

})

// get user by id and update

app.put('/users/:id',async(req,res)=>{
      let id=req.params.id
      let content=req.body;
      try{
        const result=await  User.findByIdAndUpdate(id,content)
        res.send(result)
      }
      catch(err){
                
          console.log("error",err);

      }


})


//get uset by id and delete


app.delete('/users/:id',async(req,res)=>{

    let ID=req.params.id;
    try{
      let result=await User.findByIdAndRemove(ID)
      res.json("ok")
    }
    catch(err)
    {
      console.log("error",err);
    }

})





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

mongoose.connect(url)
.then(()=>console.log("Db connected"))
.catch((error)=>console.log("error occured",error))