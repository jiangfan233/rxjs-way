import React from "react";
import { AiOutlineGithub, AiOutlineEdit, AiOutlineBuild } from "react-icons/ai";

export const Header = React.memo(() => {
  return (
    <>
      <div className="w-full flex gap-1 xs:gap-4 items-center justify-center relative h-8">
        <h2 className="font-bold text-xl xs:text-3xl grow text-center ml-12">The Rxjs Way</h2>

        <div className="grow-0 flex gap-1 xs:gap-4">
          <a href="https://github.com/jiangfan233/rxjs-way" target="_blank">
            <AiOutlineGithub size={"1.5rem"} />
          </a>
          <a
            href="https://boiling-truffle-5db.notion.site/interview-98afc8fc8b2c491ba62ed16258f99ca0"
            target="_blank"
          >
            <AiOutlineEdit size={"1.5rem"} />
          </a>
          <a
            className="self-end"
            href="https://jiangfan233.github.io/tetris/"
            target="_blank"
          >
            <AiOutlineBuild size={"1.5rem"} />
          </a>
        </div>
      </div>
    </>
  );
});

// set display name
Header.displayName = "Header";
