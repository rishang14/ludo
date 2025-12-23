import express from "express"
// import { Authenticate } from "../middleware/session";
import { initGame ,getOngoingGame, exitGame, joinGame} from "../controller/game.controller";


const router= express.Router();   


// router.use(Authenticate); 
router.post("/creategame",initGame);  
router.get('/getongoinggame/:gameId',getOngoingGame); 
router.post("/:gameId/",joinGame);  
router.delete("/exitgame/:gameId",exitGame);  





export {router as GameRoutes}