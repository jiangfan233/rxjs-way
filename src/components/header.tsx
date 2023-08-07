"use client";

import Link from "next/link";
import React from "react";
import { AiOutlineGithub, AiOutlineBuild, AiOutlineBars } from "react-icons/ai";



const Header = React.memo(({ isShowMenu, toggleMenu }: { isShowMenu: boolean, toggleMenu: Function }) => {

  return (
    <div className="global-header mx-auto p-2 w-full grow flex gap-1 xs:gap-4 items-center justify-between relative rounded-md">
      <AiOutlineBars
        size={"1.5rem"}
        className="global-header cursor-pointer z-10 h-8"
        onClick={() => toggleMenu(!isShowMenu)}
      />

      <h2 className="font-bold text-xl xs:text-2xl grow text-center ml-12">Programming Journal</h2>

      <div className="grow-0 flex gap-1 xs:gap-4">
        <a href="https://github.com/jiangfan233/rxjs-way" target="_blank">
          <AiOutlineGithub size={"1.5rem"} />
        </a>
        <Link className="self-end" href="/game" ><AiOutlineBuild size={"1.5rem"} /></Link>
      </div>
    </div>
  );
});

// set display name
Header.displayName = "Header";

export default Header;
