import express from "express"
import { Authenticate } from "../middleware/session";
import { initGame,gameValidation ,getOngoingGame, exitGame} from "../controller/game.controller";


const router= express.Router();   


router.use(Authenticate); 
router.post("/creategame",initGame);  
router.get('/getongoinggame',getOngoingGame);
router.post("/:gameId/user/:userId",gameValidation);  
router.delete("/exitgame/:gameId",exitGame); 





export {router as GameRoutes}