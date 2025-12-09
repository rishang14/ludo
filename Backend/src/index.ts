import  express from "express";
import type { Request, Response } from "express";
import { toNodeHandler,fromNodeHeaders } from "better-auth/node"; 
import  cors from "cors"
import { auth } from "./lib/auth";

const app = express();   

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));   



app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello").status(200);
});   


app.get("/api/me", async (req:Request, res:Response) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});

app.listen(8000, () => {
  console.log("sever listening on port 8000");
});
