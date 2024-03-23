import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import md5 from "md5";


const app=express();
app.use(cors());
app.use(express.json())


mongoose.connect("mongodb://127.0.0.1:27017/New_one", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Database connected..........');
}).catch((err) => {
    console.log('Database not connected');
    console.log('Database error: ', err);
});

const schema = new mongoose.Schema({
    email: String,
    password: String,
    list:[],
    total_tasks:Number,
    completed_tasks:Number,
    deleted_tasks:Number,
    pending_tasks:Number,
    sprint:Number
})





const data = mongoose.model("datas", schema);

app.post("/replaceData",(req,res)=>{
     replace();
     async function replace()
     {  
        try{
           await data.findOneAndUpdate({email:req.body.email},{list:req.body.list})
        }
        catch(err){

        }
        res.sendStatus(200);
     }
})

app.post("/setData",(req,res)=>{
    
    insert();
    async function insert(){
      var str="failure";
      try{
       const result=await data.findOne({email:req.body.email});
       
       if(result===null){
          await data.insertMany({
            email:req.body.email,
            password:md5(req.body.password),
            total_tasks:0,
            completed_tasks:0,
            pending_tasks:0,
            deleted_tasks:0,
            sprint:0
          })
          str="success";
       }  
      
      }
      catch(err)
      {
        console.log(err);
      }
      res.send(str);
   }
    
})

app.post("/getData",(req,res)=>{
   finding();
   async function finding(){
        var ans="failure";
       try{
         const result=await data.findOne({email:req.body.email});
         if(result!=null)
         ans=result;
       }
       catch(err)
       {
         console.log(err);
       }
       res.send({data:ans});
   }

})
app.post("/checkData",async (req,res)=>{
        
     
   
        var str="failure";
        try{
          const result=await data.findOne({email:req.body.email});
          if(result!==null && result.password===md5(req.body.password))
          str="success";

        }
        catch(err)
        {
          console.log(err);
        }
        res.send(str);
      
});



app.listen(8000,()=>console.log("Server is running at port 8000"));