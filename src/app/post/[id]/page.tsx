import { getFileContent } from "@lib/post";

export default async function Page({ params }: { params: { id: string } }) {
  const res = await getFileContent(params.id);

  return (
    <div
      className='markdown-body w-[100vw] sm:w-[60vw]'
      dangerouslySetInnerHTML={{ __html: res ? (res.content as string) : "" }}
    ></div>
  );
}
