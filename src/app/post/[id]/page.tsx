import { getDirStructure, getFileContent } from "@lib/post";
import { notFound } from "next/navigation";


// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
  const queue = [...getDirStructure()];
  const posts = [];

  while(queue.length > 0) {
    const item = queue.shift()!;
    posts.push(item.id);
    if(item.subMenus) {
      queue.push(...item.subMenus);
    }
  }

  return posts.map((id) => ({
    id,
  }))
}

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
