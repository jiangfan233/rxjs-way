import { getDirStructure } from "@lib/post";
import { NextResponse } from "next/server";


export const GET = async() => {
    try {
        const files = getDirStructure();
        return await NextResponse.json({ data: files, code: 200, message: "success" })
    } catch (err) {
        return NextResponse.json({ data: [], code: 404, message: "err" })
    }
}