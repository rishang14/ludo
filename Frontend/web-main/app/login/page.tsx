import { LoginButton } from "@/components/Global/loginButton";
import { getSession } from "@/lib/action/server.action";
import { redirect } from "next/navigation";

const page = async () => {
  // const session = await getSession();
  // if (session) {
  //   return redirect("/");
  // }
  return (
    <div className=" flex items-center justify-center h-screen w-full">
      <LoginButton />
    </div>
  );
};

export default page;
