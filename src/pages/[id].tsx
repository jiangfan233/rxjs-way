import type { GetStaticPaths } from "next";
import { FileStructure, getDirStructure, getFileContent } from "@lib/post";
import React, { useMemo } from "react";
import { Sider } from "@/app/components/layout/sider";
import { Header } from "@/app/components/layout/header";

export const cache = new Map();

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
  const structure = cache.get("menuArray");
  return {
    paths: check(structure),
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps = async({ params }: { params: { id: string } }) => {
  const { id } = params;
  const data = await getFileContent(id);
  if (!data) return { props: {} };
  const { content, ...rest } = data;

  if(!cache.has("manuArray")) cache.set("menuArray", getDirStructure());

  return { props: { content, menuArray: cache.get("menuArray") }, revalidate: 60 };
};

interface PageProps {
  content: string;
  menuArray: FileStructure[];
}

const Page = React.memo(({ content, menuArray }: PageProps) => {
  console.log("Page rendered");

  const memoContent = useMemo(() => {
    return content ? (
      <div
        className="w-full markdown-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    ) : null;
  }, [content]);

  return (
    <>
      <div
        className="
        flex
        items-start
        justify-start
        p-1
        overflow-y-hidden
        w-full
        xs:p-2
    "
      >
        <Sider menuArray={menuArray} />
        <div
          className="
            w-full
            flex-col 
            items-center 
            justify-start
        "
        >
          <Header />
          <div className="p-4 w-full flex flex-col items-center">
            {memoContent}
          </div>
        </div>
      </div>
    </>
  );
}, (prev, curr) => {
  const {content, menuArray} = prev;
  const {content: currContent, menuArray: currMenuArray} = curr;
  if(content !== currContent) {
    console.log("content diff");
    return false;
  }
  if(menuArray !== currMenuArray) {
    console.log("menuArray diff");
    return false;
  }
  return true;
});

Page.displayName = "Page";

export default Page;
