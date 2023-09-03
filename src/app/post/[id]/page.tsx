import { getFileContent } from "@lib/post";

export default async function Page({ params }: { params: { id: string } }) {
  const res = await getFileContent(params.id);

  return (
    <div
      className='markdown-body w-[calc(100vw-1rem)] sm:w-[calc(60vw-1rem)]'
      dangerouslySetInnerHTML={{
        __html: res ? (res.content as string) : "",
      }}></div>
  );
}
