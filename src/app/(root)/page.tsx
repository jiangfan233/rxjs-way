import { ComponentType, ReactNode } from "react";
import { ViewObj } from "./types";

export default function Page({ content }: { content: ViewObj }) {
    const { comp: Comp } = content;
    
    return <>
        <Comp />
    </>
}