import type { GetStaticPaths } from "next";
import { FileStructure, getDirStructure, getFileContent } from "@lib/post";
import React, { Suspense, lazy, useMemo } from "react";
import { Loading } from "@/app/components/loading";

const Sider = lazy(() => import("@/app/components/layout/sider"));
const Header = lazy(() => import("@/app/components/layout/header"));

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
          className="w-full markdown-body global-header"
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
          <Suspense fallback={<Loading />}>
            <Sider menuArray={menuArray} />
          </Suspense>
          <div
            className="
            w-full
            flex-col 
            items-center 
            justify-start
            md:w-[70%]
            md:mx-auto
          "
          >
            <Suspense fallback={<Loading />}>
              <Header />
            </Suspense>
            <div className="py-2 w-full flex flex-col items-center">
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

    // 目前网站托管在静态服务器，menuArray不会频繁更新
    // 但是 getStaticProps 运行在build阶段，无法缓存结果，每次都会返回一个新的 menuArray 对象
    if (
      menuArray &&
      currMenuArray &&
      menuArray.length !== currMenuArray.length
    ) {
      return false;
    }
    return true;
  }
);

Page.displayName = "Page";

export default Page;
