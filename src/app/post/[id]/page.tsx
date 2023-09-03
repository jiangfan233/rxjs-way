import { getFileContent } from "@lib/post";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const res = await getFileContent(params.id);

  if(res === null) {
    notFound();
  }

  return (
    <div
      key={params.id}
      className='markdown-body w-[calc(100vw-1rem)] sm:w-[calc(60vw-1rem)] transition-all duration-300 ease-in'
      dangerouslySetInnerHTML={{
        __html: res ? (res.content as string) : "",
      }}></div>
  );
}
