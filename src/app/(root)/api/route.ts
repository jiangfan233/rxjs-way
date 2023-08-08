import { getDirStructure, getFileContent } from "@lib/post";
import { NextResponse } from "next/server";


export const GET = async () => {
    try {
        const files = getDirStructure();
        return await NextResponse.json({ data: files, code: 200, message: "success" })
    } catch (err) {
        return NextResponse.json({ data: [], code: 404, message: "err" })
    }
}


export const POST = async (req: Request) => {

    const url = req.url!;
    const index = url.indexOf("?");
    if (index >= 0 && index < url.length) {
        const id = new URLSearchParams(url.slice(index,)).get("id");
        if (id) {
            const data = getFileContent(id);
            return NextResponse.json({ code: 200, data });
        }
    }
    return NextResponse.json({ code: 404, data: "" });
}