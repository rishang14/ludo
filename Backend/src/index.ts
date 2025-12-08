import express, { type Request, type Response } from "express"  


const app=express(); 

app.use(express.json()); 



app.get("/",(req:Request,res:Response)=>{
  
    res.send("hello").status(200)
})




app.listen(8000,()=>{
    console.log("sever listening on port 8000")
})