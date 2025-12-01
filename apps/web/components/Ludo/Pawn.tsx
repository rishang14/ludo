"use client"

interface PawnSVGProps {
  color?: string
  size?: number
  selected?: boolean
}

export const Pawn=({ color = "#EF4444", size = 60, selected = false }: PawnSVGProps)=> {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`transition-transform ${selected ? "scale-110" : "hover:scale-105"}`}
    >
      
      <ellipse cx="50" cy="85" rx="35" ry="8" fill="rgba(0,0,0,0.1)" />

     
      <circle cx="50" cy="40" r="28" fill={color} />

      <rect x="42" y="60" width="16" height="15" fill={color} />

      <ellipse cx="50" cy="80" rx="20" ry="12" fill={color} />
      <circle cx="40" cy="30" r="8" fill="white" opacity="0.3" />
      <circle cx="50" cy="40" r="28" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
    </svg>
  )
}
