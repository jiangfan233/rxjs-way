"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { FileStructure } from "@lib/post";
import { useClickOutside } from "@lib/hooks";
import { handleScreenResize } from "@lib/utils";
import { ViewObj } from "@/app/(root)/types";

type MenuItemProps = FileStructure;

const MenuItem = ({ label, id: path, subMenus }: MenuItemProps) => (
  <li className="ml-3 whitespace-nowrap list-inside">
    <Link className="" href={path}>{label}</Link>
    {subMenus ? (
      <ol className="list-disc">
        {subMenus.map(
          ({ label: childLabel, id: childPath, subMenus: childChildren }) => (
            <MenuItem
              key={path + childLabel}
              label={childLabel}
              id={childPath}
              subMenus={childChildren}
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
  gameViewArr: ViewObj[];
  setView: Function;
  gameView: ViewObj;
}

const Sider: React.FC<SiderProps> = React.memo(({ isShowMenu, toggleMenu, gameViewArr, setView, gameView }) => {

  const [menuArray, setMenuArray] = useState([]);

  const memoMenuItems = useMemo(() => {
    return (
      menuArray &&
      menuArray.map(({ label, id, subMenus }) => (
        <MenuItem key={id + label} label={label} id={id} subMenus={subMenus} />
      ))
    );
  }, [menuArray]);


  const siderRef = useRef<HTMLDivElement>(null);

  const clickOutside = useClickOutside(siderRef, toggleMenu);

  

  const handleClick = useCallback(
    (e: MouseEvent, viewObj: ViewObj) => {
      e.preventDefault();
      setView(viewObj);
      document.documentElement.focus();
    },
    [setView]
  );

  const radios = useMemo(() => <>
    <p className="mb-1">Old Tiny Games</p>
    <ul className="pl-8 list-disc p-2 global-sider rounded-md">
      {gameViewArr.map((viewObj) => (
        <li key={viewObj.key}>
          <label className="cursor-pointer">
            <button
              className={
                "px-1 rounded-lg " +
                (viewObj.key == gameView.key
                  ? "border-indigo-300 border-2 border-solid bg-indigo-400 text-white"
                  : "")
              }
              name="selector"
              onClick={(e: any) => handleClick(e, viewObj)}
            >
              {viewObj.key}
            </button>
          </label>
        </li>
      ))}
    </ul>
  </>, [gameView]);

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
        setMenuArray(data);
      }
    }
    getData();
  }, [])

  return (
    <div
      ref={siderRef}
      className={(isShowMenu 
        ? "max-h-[100vh] overflow-scroll" 
        : "absolute -z-10 opacity-0 max-h-0") 
      + " w-fit pr-1 transition-all duration-300 rounded-md overflow-hidden list-disc"}
    >
      <ol
        className={" mb-3 global-sider rounded-md pr-4"}
      >
        {memoMenuItems}
      </ol>
      {radios}
    </div>
  );
});

Sider.displayName = "Sider";

export default Sider;
