import React from "react"
import { AiOutlineLoading } from "react-icons/ai"


export const Loading = React.memo(() => {
  return <>
    <AiOutlineLoading size={"4rem"} />
  </>
})

Loading.displayName = "Loading";