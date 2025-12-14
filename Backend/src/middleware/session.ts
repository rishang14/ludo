import type { NextFunction, Request,Response } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { Session, User } from "better-auth/*";


declare global {
  namespace Express {
    interface Request {
      session?:Session ; 
      user?:User
    }
  }
}


export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
       return res.json({success:false, error:"Unauthorized"}).status(401)
    } 
    req.session=session.session  
    req.user=session.user 
    next();
  } catch (error) { 
    console.log("Failde in middleware");
   return res.json({ error: "Internal Server Error" }).status(500);
  }
};
