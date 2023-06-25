import Link from "next/link";
import React from "react";
import { AiOutlineGithub, AiOutlineBuild } from "react-icons/ai";

const Header = React.memo(() => {
  return (
    <>
      <div className="global-header px-2 w-full flex gap-1 xs:gap-4 items-center justify-center relative h-8">
        <h2 className="font-bold text-xl xs:text-2xl grow text-center ml-12">The Rxjs Way</h2>

        <div className="grow-0 flex gap-1 xs:gap-4">
          <a href="https://github.com/jiangfan233/rxjs-way" target="_blank">
            <AiOutlineGithub size={"1.5rem"} />
          </a>
          <Link className="self-end" href="/game" ><AiOutlineBuild size={"1.5rem"} /></Link>
        </div>

      </div>
    </>
  );
});

// set display name
Header.displayName = "Header";

export default Header;
