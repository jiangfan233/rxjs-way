import React from "react";
import Link from "next/link";

interface MenuItemProps {
  label: string;
  path: string;
  children?: MenuItemProps[];
}

const MenuItem = React.memo(
  ({ label, path, children }: MenuItemProps) => (
    <>
      <li>
        <Link href={path}>{label}</Link>
        {children ? (
          <ul>
            {children.map(
              ({
                label: childLabel,
                path: childPath,
                children: childChildren,
              }) => (
                <MenuItem
                  key={path}
                  label={childLabel}
                  path={childPath}
                  children={childChildren}
                />
              )
            )}
          </ul>
        ) : null}
      </li>
    </>
  )
);

interface SiderProps {
  menuArray: MenuItemProps[];
  isShowMenu: boolean;
}

export const Sider: React.FC<SiderProps> = ({ menuArray, isShowMenu }) => {
  return (
    <>
      <ul 
        className={ "h-full hidden collapse md:visible md:block" }
        style={{ visibility: isShowMenu ? "visible" : "unset" }}
      >
        {menuArray.map(({ label, path, children }) => (
          <MenuItem
            key={path}
            label={label}
            path={path}
            children={children}
          />
        ))}
      </ul>
    </>
  );
};
