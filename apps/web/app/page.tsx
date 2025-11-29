import { StartBorad } from "../components/Ludo/StartBorad";

export default function Page() {
  return (
    <div className=" md:max-w-5xl mx-auto h-screen flex items-center p-5 flex-col  justify-start gap-2   ">
      <div className=" space-y-2">
        <h2 className="text-white text-center  text-4xl font-serif">
          Ludo Board
        </h2>
      </div>

      <div id="ludoBoard" className="rounded-sm">
        <div className="red-board flex items-center justify-center rounded-sm bg-red-700/70">
          <StartBorad bgColor="bg-red-500" />
        </div>
        <div className="red-path horizontal-path bg-zinc-50">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="-m-px border border-slate-950"></div>
          ))}
        </div>
        <div className="green-board flex items-center justify-center rounded-sm bg-green-500/80">
          <StartBorad bgColor="bg-green-500" />
        </div>
        <div className="green-path vertical-path bg-zinc-50">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className=" border-b-[.25px]  border-r-[.25px] border-l-0  border-slate-950"></div>
          ))}
        </div>
        <div className="win-zone rounded-sm bg-zinc-50  border-t-0 border-r-0 border-b-[0.25px] border-l-[.25px] border-slate-950"></div>
        <div className="blue-board rounded-sm  flex items-center justify-center bg-blue-500/70">
          <StartBorad bgColor="bg-blue-500" />
        </div>
        <div className="blue-path vertical-path bg-zinc-50">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className=" border-b-[.25px]  border-r-[.25px] border-l-0 border-slate-950"></div>
          ))}
        </div>
        <div className="yellow-board flex items-center justify-center rounded-sm  bg-yellow-300/70">
          <StartBorad bgColor="bg-yellow-400" />
        </div>
        <div className="yellow-path horizontal-path bg-zinc-50">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className=" -m-px border border-slate-950"></div>
          ))}
        </div>
      </div>
      <div className="h-[100px] mx-auto flex p-2 justify-center  w-[80%] bg-slate-800 rounded-md ">
        <h1 className="text-white font-serif   ">Dice Roll</h1>
      </div>
    </div>
  );
}
