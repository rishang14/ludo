export const dynamic = 'force-dynamic'

import Ludo from "@/components/Ludo/Mainboard";
import {  getSession } from "@/lib/action/server.action";
import { redirect } from "next/navigation";

const page = async ({
  params,
}: {
  params: Promise<{ gameId: string; }>;
}) => {
  // const userExist = await getSession();
  // if (!userExist) {
  //   redirect("/login");
  // }
  const { gameId } = await params; 
//   if(!gameId ) return redirect("/"); 

//  const game= await getGameUserDetails(gameId) 

//  if(!game || !game.data){
//  return redirect("/");
//  }
 
  return <Ludo gameId={gameId}  />;
};

export default page;
