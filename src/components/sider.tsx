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
  <li className="ml-3 whitespace-nowrap list-inside">
    <span className={(path === activeId ? " text-lg font-semibold text-orange-500" : "text-base") + " cursor-pointer"} id={path}>{label}</span>
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
      <div key={id}>
        <p className="mb-1">{label}</p>
        {menuItems ? <ul key={id} className={" mb-3 global-sider rounded-md pr-4"}>
          {menuItems.map(({ label, id, subMenus }) => (
            <MenuItem key={id + label} label={label} id={id} subMenus={subMenus} activeId={activeId} />
          ))}
        </ul> : null}
      </div>
    )}
  </>, [menuArray, activeId]);


  const siderRef = useRef<HTMLDivElement>(null);

  const clickOutside = useClickOutside(siderRef, toggleMenu);

  // click outside
  useEffect(() => {
    if (isShowMenu == false) return;
    const [listenClickOutside, stopListen] = clickOutside();
    if (document.documentElement.clientWidth <= 500) {
      listenClickOutside();
    }
    const cancel = handleScreenResize(() => {
      if (document.documentElement.clientWidth <= 500) {
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
      const res = await fetch("/api");
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
        if(e.target.id !== undefined && e.target.id != "") {
          // @ts-ignore
          handleIdChange(e.target.id);

        }
      }}
      className={(isShowMenu
        ? "max-h-[100vh] overflow-scroll"
        : "absolute -z-10 opacity-0 max-h-0")
        + " w-fit min-w-[20rem] pr-1 transition-all duration-300 rounded-md select-none overflow-hidden list-disc"}
    >

      {memoMenuItems}

    </div>
  );
});

Sider.displayName = "Sider";

export default Sider;
