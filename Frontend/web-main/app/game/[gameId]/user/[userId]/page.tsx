export const dynamic = 'force-dynamic'

import Ludo from "@/components/Ludo/Mainboard";
import { getGameUserDetails, getSession } from "@/lib/action/server.action";
import { redirect } from "next/navigation";

const page = async ({
  params,
}: {
  params: Promise<{ gameId: string; userId: string }>;
}) => {
  const userExist = await getSession();
  if (!userExist) {
    redirect("/login");
  }
  const { gameId, userId } = await params; 
  if(!gameId || !userId) return; 

  const checkvalid = await getGameUserDetails(gameId, userId);
  console.log(checkvalid,"valid type  of user")
  if(!checkvalid.success){
    return redirect("/")
  }  


  
  return <Ludo gameId={gameId} userId={userId} />;
};

export default page;
