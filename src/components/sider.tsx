"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FileStructure } from "@lib/post";
import { useClickOutside } from "@lib/hooks";
import { handleScreenResize } from "@lib/utils";


type MenuItemProps = FileStructure & {
  // handleIdChange: Function;
  activeId: string;
};

const MenuItem = ({ label, id: path, subMenus, activeId }: MenuItemProps) => (
  <li className="ml-3 list-inside">
    <span className={(path === activeId
      ? " text-lg font-semibold text-orange-500"
      : "text-base")
      + " cursor-pointer sm:whitespace-break-spaces"} id={path}>{label}</span>
    {subMenus ? (
      <ol className="list-disc">
        {subMenus.map(
          ({ label: childLabel, id: childPath, subMenus: childChildren }) => (
            <MenuItem
              key={path + childLabel}
              label={childLabel}
              id={childPath}
              subMenus={childChildren}
              activeId={activeId}
            />
          )
        )}
      </ol>
    ) : null}
  </li>
);


interface SiderProps {
  isShowMenu: Boolean;
  toggleMenu: Function;
  handleIdChange: Function;
  activeId: string;
}

const Sider: React.FC<SiderProps> = React.memo(({ isShowMenu, toggleMenu, handleIdChange, activeId }) => {

  const [menuArray, setMenuArray] = useState<FileStructure[]>([{
    label: "Old tiny games",
    id: "gamesMenu",
    subMenus: [
      { label: "mine sweepers", id: "mineSweepers", subMenus: null },
      { label: "snake", id: "snake", subMenus: null },
      { label: "tetris", id: "tetris", subMenus: null },
    ]
  }]);

  const memoMenuItems = useMemo(() => <>
    {menuArray.map(({ label, id, subMenus: menuItems }) =>
      <div key={id} className="mb-3">
        <p className="mb-1">{label}</p>
        <ul key={id} className={"pb-2 pr-2 global-sider rounded-md sm:whitespace-pre md:whitespace-nowrap "}>
          {menuItems ? menuItems.map(({ label, id, subMenus }) => (
            <MenuItem key={id + label} label={label} id={id} subMenus={subMenus} activeId={activeId} />
          )) : null}
        </ul>
      </div>
    )}
  </>, [menuArray, activeId]);


  const siderRef = useRef<HTMLDivElement>(null);

  const clickOutside = useClickOutside(siderRef, toggleMenu);

  // click outside
  useEffect(() => {
    if (isShowMenu == false) return;
    const [listenClickOutside, stopListen] = clickOutside();
    if (document.documentElement.clientWidth <= 640) {
      listenClickOutside();
    }
    const cancel = handleScreenResize(() => {
      if (document.documentElement.clientWidth <= 640) {
        listenClickOutside();
      } else {
        stopListen();
      }
    }, 100);

    return () => {
      stopListen();
      cancel();
    };
  }, [toggleMenu, clickOutside, isShowMenu]);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api", { cache: "force-cache" });
      const { code, data } = await res.json();
      if (code == 200) {
        setMenuArray(items => [{ label: "Reading & Doing", id: "Reading & Doing", subMenus: data }, ...items]);
      }
    }
    getData();
  }, [])

  return (
    <div
      ref={siderRef}
      onClick={(e) => {
        e.stopPropagation();
        // @ts-ignore
        if (e.target.id !== undefined && e.target.id != "") {
          // @ts-ignore
          handleIdChange(e.target.id);

        }
      }}
      className={(isShowMenu
        ? " fixed text-base max-h-[calc(100vh-1rem)] overflow-x-hidden overflow-y-scroll left-0 top-0 z-20 pr-1 sm:relative sm:max-w-[40vw] sm:min-w-[30vw] md:max-w-[40vw] xl:max-w-[20vw] xl:min-w-[15vw]"
        : " -translate-x-full text-[0.2rem] max-w-[0] -z-10 left-0 top-0 opacity-0 max-h-0")
        + "  w-fit transition-all duration-300 rounded-md select-none overflow-hidden list-disc"}
    >

      {memoMenuItems}

    </div>
  );
});

Sider.displayName = "Sider";

export default Sider;
