import { FiStar } from "react-icons/fi";
import {
  blueSafePlace,
  greenSafePlace,
  redSafePlace,
  yellowSafePlace,
} from "@/lib/constant"; 


interface prop {
  path: string[];
  safePlace: redSafePlace | greenSafePlace | yellowSafePlace | blueSafePlace;
  pathname: string;
  className: string;
}

export const DrawPath = ({ path, safePlace, className }: prop) => {
  return (
    <>
      {path.map((p: string, i: number) => (
        <div key={i} id={p} className={`${className} flex items-center justify-center  `}>
          {
            (safePlace[0] == p || safePlace[1]== p) && <span><FiStar size={20}  /></span>
          }
        </div>
      ))}
    </>
  );
};
