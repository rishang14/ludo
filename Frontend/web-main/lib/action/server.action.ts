"use server"  
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

export  const exitOrCancelGame=async(gameId:string)=>{
  try {
    const res =await fetch(`${process.env.NEXT_PUBLIC_API_HTTP_ENDPOINT}/game/exitgame/${gameId}`,{ 
      method:"DELETE",
      headers:await headers()
    })  
    const value= await res.json(); 
  } catch (error) {  
    console.log(error);
  }
}  

export const getGameUserDetails= async(gameId:string,userId:string)=>{
  try {
    const  val= await fetch(`${process.env.NEXT_PUBLIC_API_HTTP_ENDPOINT}/game/${gameId}/user/${userId}`,{
      method:"POST",
      headers:await headers()
    })  
    const res=await val.json() 
    return res; 
  } catch (error) {
    console.log(error);
  }
}