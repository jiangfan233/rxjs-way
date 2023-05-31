import React from "react";
import Link from "next/link";
import { AiOutlineBars } from "react-icons/ai";
import { FileStructure } from "../../../../lib/post";

type MenuItemProps = FileStructure;

const MenuItem = ({ label, id: path, children }: MenuItemProps) => (
  <>
    <li className="mx-4">
      <Link href={path}>{label}</Link>
      {children ? (
        <ol className="list-disc">
          {children.map(
            ({
              label: childLabel,
              id: childPath,
              children: childChildren,
            }) => (
              <MenuItem
                key={path}
                label={childLabel}
                id={childPath}
                children={childChildren}
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
  isShowMenu: boolean;
  toggleMenu: Function;
}

export const Sider: React.FC<SiderProps> = ({
  menuArray,
  isShowMenu,
  toggleMenu,
}) => {
  return (
    <div
      className={
        (isShowMenu
          ? "fixed min-w-4/5 z-10 bg-slate-300 xs:relative xs:min-w-1/4 md:min-w-1/5 xs:max-w-xs"
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
          {menuArray.map(({ label, id, children }) => (
            <MenuItem
              key={id}
              label={label}
              id={id}
              children={children}
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
