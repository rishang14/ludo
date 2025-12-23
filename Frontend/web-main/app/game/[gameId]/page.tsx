export const dynamic = 'force-dynamic'

import Ludo from "@/components/Ludo/Mainboard";
import { getOngoingGame } from "@/lib/action/server.action";
import { redirect } from "next/navigation"
import { toast } from "sonner";

const page = async ({
  params,
}: {
  params: Promise<{ gameId: string; }>;
}) => {

  const { gameId } = await params; 
  if(!gameId ) return redirect("/"); 

 const game=await getOngoingGame(gameId); 
 

 if(!game.data){ 
  return redirect("/");
 } 

 if(game.data.status==="completed"){ 
  return redirect("/")
 }
 
  return <Ludo gameId={gameId}  />;
};

export default page;
