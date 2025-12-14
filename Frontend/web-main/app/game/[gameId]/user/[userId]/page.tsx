import Ludo from "@/components/Ludo/Mainboard";
import { getGameUserDetails, getSession } from "@/lib/action/server.action";
import { redirect } from "next/navigation";

const page = async ({
  params,
}: {
  params: Promise<{ gameId: string; userId: string }>;
}) => {  
  const session=await getSession(); 
  if(!session){
    redirect("/login");
  } 
  const { gameId, userId } = await params;

  const checkvalid= await getGameUserDetails(gameId,userId); 
  console.log(checkvalid,"valid")

  return <Ludo />;
};

export default page;
