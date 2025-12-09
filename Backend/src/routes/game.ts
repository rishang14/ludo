import type {Request,Response} from "express";  
import express from "express"
import { Authenticate } from "../middleware/session";


const router= express.Router();    


router.use(Authenticate); 
router.post("/play-game",async(req:Request,res:Response)=>{

})



export {router as Game}