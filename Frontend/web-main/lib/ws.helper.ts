import { useSocket } from "@/state/socketClient";
import { redirect } from "next/navigation"
import { toast } from "sonner"



export const redirectUserTohomeWithToast=(data:string)=>{
    toast.info("Game End",{duration:3000,description: `${data} has exited the game `}) 
    redirect("/");  

} 


export const userJoinedBroadCast= (data:string)=>{
    toast.info("user joined",{duration:3000,description:`${data} joined the room`})
}  

export const sendPawnMoveToServer=(gameId:string,userId:string,pId :string)=>{ 
    useSocket.getState().sendToServer("pawn_Clicked",{gameId,userId,pId}) 
}