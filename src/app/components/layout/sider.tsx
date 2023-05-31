import React, { useState } from "react";
import Link from "next/link";
import { AiOutlineBars } from "react-icons/ai";
import { FileStructure } from "../../../../lib/post";

type MenuItemProps = FileStructure;

const MenuItem = ({ label, id: path, subMenus }: MenuItemProps) => (
  <>
    <li className="mx-4">
      <Link href={path}>{label}</Link>
      {subMenus ? (
        <ol className="list-disc">
          {subMenus.map(
            ({
              label: childLabel,
              id: childPath,
              subMenus: childChildren,
            }) => (
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

export const Sider: React.FC<SiderProps> = ({
  menuArray,
}) => {

  const [isShowMenu, toggleMenu] = useState(false);

  return (
    <div
      className={
        (isShowMenu
          ? "fixed min-w-4/5 z-10 bg-slate-300 xs:relative xs:min-w-1/4 xs:max-w-xs"
          : "") + " z-10 flex items-start justify-start"
      }
    >
      <div className="relative w-full">
        <ol
          className={
            (isShowMenu ? "" : "w-0 -z-10 invisible") +
            " relative list-disc xs:min-w-1/4 py-1 h-[96vh]"
          }
        >
          {menuArray && menuArray.map(({ label, id, subMenus }) => (
            <MenuItem
              key={id + label}
              label={label}
              id={id}
              subMenus={subMenus}
            />
          ))}
        </ol>
        <AiOutlineBars
          className="absolute top-0 left-full cursor-pointer z-10 h-8 ml-4"
          onClick={() => toggleMenu(!isShowMenu)}
        />
      </div>
    </div>
  );
};
