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