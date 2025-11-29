import React from "react";

export const StartBorad = ({bgColor}:{bgColor:string}) => {
  return (
    <div className="w-[65%] p-2 rounded-sm h-[65%] bg-zinc-50">
      <div className=" h-full w-full flex items-center justify-between flex-wrap  ">
        {[1, 2, 3, 4].map((i) => {
          return (
            <div
              className={`rounded-full h-[40%]  w-[40%] ${bgColor}`}
              key={i}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

