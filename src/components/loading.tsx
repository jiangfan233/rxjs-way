import React from "react"
import { AiOutlineLoading } from "react-icons/ai"


export const Loading = React.memo(({ size = "4rem" }: { size: string }) => {
  return <div className="flex items-center justify-center w-full h-full">
    <AiOutlineLoading size={size} />
  </div>
})

Loading.displayName = "Loading";