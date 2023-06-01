import type {
  GetStaticPaths,
} from "next";
import { FileStructure, getDirStructure, getFileContent } from "../../lib/post";
import { FileContent } from "../../lib/post";

const check = (structure: FileStructure[]) => {
  if (!structure || structure.length === 0) return [];
  let result: { params: { id: string } }[] = [];
  const queue = structure.slice();
  while (queue.length) {
    const item = queue.shift()!;

    const { id, subMenus } = item;

    if (!Array.isArray(subMenus)) result.push({ params: { id } });
    else queue.push(...subMenus);
  }
  return result;
};

export const getStaticPaths: GetStaticPaths = () => {
  const structure = getDirStructure();
  return {
    paths: check(structure),
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const data = getFileContent(id);
  if(!data) return { props: {} } 
  const { content, ...rest } = data;
  const menuArray = getDirStructure();

  return { props: { content, menuArray, ...rest } };
};

export default function Page({ content, ...rest }: FileContent) {
  return (
    <>
      { content ? <div className="w-full markdown-body" dangerouslySetInnerHTML={{ __html: content }} /> : null}
    </>
  );
}
