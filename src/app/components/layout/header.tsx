import React from "react";
import { AiOutlineGithub, AiOutlineEdit } from "react-icons/ai"

export const Header = React.memo(() => {
  return (
    <>
      <div className="w-full flex gap-4 items-center justify-center relative h-8">
        <h2 className="font-bold text-3xl">The Rxjs Way</h2>

        <a href="https://github.com/jiangfan233/rxjs-way" target="_blank">
          <AiOutlineGithub size={"2rem"} />
        </a>
        <a href="https://boiling-truffle-5db.notion.site/interview-98afc8fc8b2c491ba62ed16258f99ca0" target="_blank">
          <AiOutlineEdit size={"2rem"} />
        </a>
      </div>
    </>
  );
});

// set display name
Header.displayName = "Header";