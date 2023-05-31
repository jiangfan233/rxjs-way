"use client";

import { useState } from "react";
import { Header } from "./header";
import { Sider } from "./sider";
import { FileStructure } from "../../../../lib/post";




interface LayoutProps {
  children: React.ReactNode;
  menuArray: FileStructure[];
}

export const Layout: React.FC<LayoutProps> = ({ children, menuArray }) => {
  const [isShowMenu, toggleMenu] = useState(false);

  return (
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
      <Sider
        menuArray={menuArray}
        toggleMenu={toggleMenu}
        isShowMenu={isShowMenu}
      />
      <div
        className="
            w-full
            flex-col 
            items-center 
            justify-start
        "
      >
        <Header />
        <div className="p-4 w-full flex flex-col items-center">{children}</div>
      </div>
    </div>
  );
};
