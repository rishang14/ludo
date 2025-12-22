export const dynamic = 'force-dynamic'

import Ludo from "@/components/Ludo/Mainboard";

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
