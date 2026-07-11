import React from 'react'

export default function Loader3() {
  return (
    <>
    <div className="flex flex-row items-center py-[2px] gap-2">
  <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
  <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
  <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
   </div>

    </>
  )
}
