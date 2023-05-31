import React from "react";
import { AiOutlineGithub } from "react-icons/ai"

export const Header = React.memo(() => {
  return (
    <>
      <div className="w-full flex gap-4 items-center justify-center relative h-8">
        <h2 className="font-bold text-3xl">The Rxjs Way</h2>

        <a href="https://github.com/jiangfan233/rxjs-way" target="_blank">
          <AiOutlineGithub size={"2rem"} />
        </a>
      </div>
    </>
  );
});

// set display name
Header.displayName = "Header";