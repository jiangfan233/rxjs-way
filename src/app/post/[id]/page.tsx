import { getFileContent } from "@lib/post";

export default async function Page({ params }: { params: { id: string } }) {
  const res = await getFileContent(params.id);

  return (
    <div
      className='markdown-body'
      dangerouslySetInnerHTML={{ __html: res ? (res.content as string) : "" }}
    ></div>
  );
}
