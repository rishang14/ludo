export default function Page() {
  return (
    <div className=" md:max-w-5xl md:mx-auto p-2 flex items-center  justify-center gap-5 flex-col  h-screen bg-zinc-700">
      <div className=" space-y-4">
        <h2 className="text-white text-center  text-4xl font-serif">
          Ludo Board
        </h2>
      </div>

      <div id="ludoBoard">
        <div className="red-board  bg-red-700/70">Red Board</div>
        <div className="red-path  bg-white"></div>
        <div className="green-board  bg-green-500/70">Green Board</div>
        <div className="green-path bg-white">{/* GreenPath */}</div>
        <div className="win-zone bg-white border-[0.25px] border-slate-950"></div>
        <div className="blue-board  bg-blue-500/70">Blue Board</div>
        <div className="blue-path bg-white">{/* BluePath */}</div>
        <div className="yellow-board  bg-yellow-300/70">Yellow Board</div>
        <div className="yellow-path bg-white">{/* YellowPath */}</div>
      </div>
    </div>
  );
}
