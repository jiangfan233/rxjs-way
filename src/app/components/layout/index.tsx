"use client"

import { useState } from "react";
import { Header } from "./header";
import { Sider } from "./sider";


const menuArray = [
    {
        label: "this is 1",
        path: "1",
        children: [
            {
                label: "1-1",
                path: "1-1"
            },
            {
                label: "1-2",
                path: "1-2"
            },
        ]
    },
    {
        label: "this is 2",
        path: "2",
        children: [
            {
                label: "2-1",
                path: "2-1"
            },
            {
                label: "2-2",
                path: "2-2"
            },
        ]
    }
]


interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isShowMenu, toggleMenu] = useState(false);

    return <div className="
        flex
        items-start
        justify-between
    ">
        <Sider menuArray={menuArray} isShowMenu={isShowMenu} />
        <div className="
            flex-col 
            items-center 
            justify-start
            w-screen
            md:w-10/12
        ">
            <Header isShowMenu={isShowMenu} toggleMenu={toggleMenu} />
            <div className="">
                { children }
            </div>
        </div>
    </div>
}