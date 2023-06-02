import type { GetStaticPaths } from "next";
import { FileStructure, getDirStructure, getFileContent } from "@lib/post";
import React, { useMemo } from "react";
import { Sider } from "@/app/components/layout/sider";
import { Header } from "@/app/components/layout/header";


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
  return {
    paths: check(getDirStructure()),
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const data = getFileContent(id);
  if (!data) return { props: {} };
  const { content, ...rest } = data;

  return {
    props: {
      content,
      menuArray: getDirStructure(),
    },
    // 每当有用户访问这个页面时，Next.js 会先从缓存中读取已经生成的页面，
    // 然后检查页面是否过期，如果过期了，则会在后台重新生成页面，并将新页面缓存起来，以供下一次访问时使用。
    // revalidate: 60,
  };
};

interface PageProps {
  content: string;
  menuArray: FileStructure[];
}

const Page = React.memo(
  ({ content, menuArray }: PageProps) => {
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
  },
  (prev, curr) => {
    const { content, menuArray } = prev;
    const { content: currContent, menuArray: currMenuArray } = curr;
    if (content !== currContent) {
      return false;
    }
    if (menuArray.length !== currMenuArray.length) {
      return false;
    }
    return true;
  }
);

Page.displayName = "Page";

export default Page;
