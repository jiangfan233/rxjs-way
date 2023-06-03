import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AiOutlineBars } from "react-icons/ai";
import { FileStructure } from "@lib/post";
import { useClickOutside } from "@lib/hooks";
import { handleScreenResize } from "@lib/utils";

type MenuItemProps = FileStructure;

const MenuItem = ({ label, id: path, subMenus }: MenuItemProps) => (
  <>
    <li className="mx-4">
      <Link href={path}>{label}</Link>
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
  </>
);

interface SiderProps {
  menuArray: MenuItemProps[];
}

export const Sider: React.FC<SiderProps> = React.memo(({ menuArray }) => {
  const [isShowMenu, toggleMenu] = useState(true);

  const memoMenuItems = useMemo(() => {
    return (
      menuArray &&
      menuArray.map(({ label, id, subMenus }) => (
        <MenuItem key={id + label} label={label} id={id} subMenus={subMenus} />
      ))
    );
  }, [menuArray]);

  const memoToggleMenu = useCallback(() => {
    toggleMenu(!isShowMenu);
  }, [isShowMenu, toggleMenu]);

  const siderRef = useRef<HTMLDivElement>(null);

  const toggleButton = useMemo(
    () => (
      <AiOutlineBars
        size={"1.5rem"}
        className="absolute top-0 box-content bg-gray-100 text-black left-full cursor-pointer z-10 h-8 px-2 xs:pl-6 xs:pr-4"
        onClick={memoToggleMenu}
      />
    ),
    [memoToggleMenu]
  );

  const clickOutside = useClickOutside(siderRef, memoToggleMenu);

  useEffect(() => {
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
  }, [memoToggleMenu, clickOutside]);

  return (
    <div
      ref={siderRef}
      className={
        (isShowMenu
          ? " min-w-4/5 z-10 xs:relative xs:min-w-1/4 xs:max-w-xs"
          : "-translate-x-full") +
        " transition-transform z-10 flex bg-[#14191f] text-slate-50 items-start justify-start"
      }
    >
      <div className="relative w-full">
        <ol
          className={
            (isShowMenu ? "" : "w-0 px-0 -z-10 invisible transition-all") +
            " relative list-disc xs:min-w-1/4 p-3 h-[100vh]"
          }
        >
          {memoMenuItems}
        </ol>
        {toggleButton}
      </div>
    </div>
  );
});

Sider.displayName = "Sider";
