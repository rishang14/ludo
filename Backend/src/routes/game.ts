import express from "express"
import { Authenticate } from "../middleware/session";
import { initGame,gameValidation } from "../controller/game.controller";


const router= express.Router();   


router.use(Authenticate); 
router.post("/initgame",initGame); 
router.post("game/:gameId/user/:userId",gameValidation);  
router.post("/exitgame",); 





export {router as GameRoutes}