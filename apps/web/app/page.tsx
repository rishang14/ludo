export default function Page() {
  return (
    <div className=" md:max-w-5xl md:mx-auto p-2 flex items-center  justify-center gap-5 flex-col  h-screen">
      <div className=" space-y-4">
        <h2 className="text-white text-center  text-4xl font-serif">
          Ludo Board
        </h2>
      </div>

      <div id="ludoBoard" className="rounded-sm">
        <div className="red-board flex items-center justify-center rounded-sm bg-red-700/70">
          <div className="w-[65%] rounded-sm h-[65%] bg-zinc-50"></div>
        </div>
        <div className="red-path  bg-zinc-50"></div>
        <div className="green-board flex items-center justify-center rounded-sm bg-green-500/70">
          {" "}
          <div className="w-[65%] rounded-sm h-[65%] bg-zinc-50"></div>
        </div>
        <div className="green-path bg-zinc-50">{/* GreenPath */}</div>
        <div className="win-zone rounded-sm bg-zinc-50 border-[0.25px] border-slate-950"></div>
        <div className="blue-board rounded-sm  flex items-center justify-center bg-blue-500/70">
          {" "}
          <div className="w-[65%] rounded-sm h-[65%] bg-zinc-50"></div>
        </div>
        <div className="blue-path bg-zinc-50">{/* BluePath */}</div>
        <div className="yellow-board flex items-center justify-center rounded-sm  bg-yellow-300/70">
          {" "}
          <div className="w-[65%] rounded-sm h-[65%] bg-zinc-50"></div>
        </div>
        <div className="yellow-path bg-zinc-50">{/* YellowPath */}</div>
      </div>
    </div>
  );
}
