"use client"
import type React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


type dialogProp = {
  isDialogOpen: boolean 
  userId:string
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const Creategameform: React.FC<dialogProp> = ({ isDialogOpen, setDialogOpen,userId }) => {  
  const router=useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors,isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => { 
    try {
      const createGame= await axios.post(`${process.env.NEXT_PUBLIC_API_HTTP_ENDPOINT}/game/creategame`,{
        totalPlayers:+data.totalPlayers, 
      },{withCredentials:true})    
      
      setDialogOpen(false);
      if(createGame.data.success){    
        let GameTitle= createGame.status ===201 ? "Game Created Successfully" : "Already in a Game"
        toast.success(GameTitle,{duration:3000,description:createGame.data.message})  
        router.push(`game/${createGame.data.data}`);
      } 
    } catch (error:any) {
      console.log(error,"error");
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[500px] border-2 border-primary/30  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold uppercase tracking-wide">
            <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">Invite Players</span>
          </DialogTitle>
          <DialogDescription className="text-base font-medium">
            Enter player details to start your multiplayer battle
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="totalPlayers">Total Number of Players</Label>
            <Select onValueChange={(value) => setValue("totalPlayers", value)} defaultValue="">
              <SelectTrigger disabled={isSubmitting} id="totalPlayers" className={errors.totalPlayers ? "border-destructive" : ""}>
                <SelectValue placeholder="Select number of players" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="3">3 Players</SelectItem>
                <SelectItem value="4">4 Players</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="hidden"
              {...register("totalPlayers", {
                required: "Please select number of players",
              })}
            />
            {errors.totalPlayers && <p className="text-sm text-destructive">{errors.totalPlayers.message as string}</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setDialogOpen(false)} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary">
              Send Invite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
