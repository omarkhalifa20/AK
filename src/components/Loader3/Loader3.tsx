import React from 'react'

export default function Loader3() {
  return (
    <>
    <div className="flex flex-row items-center gap-2">
  <div className="w-3 h-3 rounded-full bg-white animate-bounce" />
  <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-.3s]" />
  <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-.5s]" />
   </div>

    </>
  )
}
