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

    const { id, children } = item;

    if (!Array.isArray(children)) result.push({ params: { id } });
    else queue.push(...children);
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
  const { content, ...rest } = getFileContent(id)!;
  const menuArray = getDirStructure();

  return { props: { content, menuArray, ...rest } };
};

export default function Page({ content, ...rest }: FileContent) {
  return (
    <>
      <div className="w-full" dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}
