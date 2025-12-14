"use server"  
import axios from "axios";
import { headers } from "next/headers";

export const getSession= async()=>{
 try {
     const data= await fetch('http://localhost:8000/api/me',{
        headers: await headers()
     });   
  const  value=  await data.json(); 
  
  if(!value.session || !value.user){
    return null; 
  }  

  return value.user;
 } catch (error) {
    return null;
 }
}   



export const getOngoingGame= async()=>{
  try {
   const value= await fetch(`${process.env.NEXT_PUBLIC_API_HTTP_ENDPOINT}/game/getongoinggame`,{
      headers:await headers()
   }) ; 
    const data = await value.json(); 
    return data;
  } catch (error) {
    console.log("error in onginog game",error);
  }
}