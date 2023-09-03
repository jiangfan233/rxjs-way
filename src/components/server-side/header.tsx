import React from "react";
import { AiOutlineGithub, AiOutlineBars } from "react-icons/ai";

import { Sider } from "@/components/server-side/sider";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <div className='global-header mx-auto p-2 w-[calc(100vw-1rem)] sm:w-[calc(60vw-1rem)] h-12 grow flex gap-1 xs:gap-4 items-center justify-between rounded-md fixed top-0 left-1/2 -translate-x-1/2'>
      <div className='relative'>
        <a href='#' className='toggle peer relative focus:text-sky-500'>
          <AiOutlineBars className=' cursor-pointer z-10 h-8 text-inherit' />
        </a>
        <Sider />
      </div>

      <h2 className='font-bold text-xl xs:text-2xl grow text-center'>
        Programming Journal
      </h2>

      <div className='grow-0 flex gap-1 xs:gap-4'>
        <a
          className='relative'
          href='https://github.com/jiangfan233/rxjs-way'
          target='_blank'>
          <AiOutlineGithub className='text-2xl' />
        </a>
      </div>
    </div>
  );
};

// set display name
Header.displayName = "Header";
