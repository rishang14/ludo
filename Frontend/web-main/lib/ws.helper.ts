import { redirect } from "next/navigation"
import { toast } from "sonner"



export const redirectUserTohomeWithToast=(data:string)=>{
    toast.info("Game End",{duration:3000,description: `${data} has exited the game `}) 
    redirect("/");
}