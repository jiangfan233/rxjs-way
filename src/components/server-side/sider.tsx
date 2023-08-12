import { FileStructure, getDirStructure } from "@lib/post";
import Link from "next/link";

type MenuItemProps = FileStructure;

const MenuItem = ({ label, id: path, subMenus }: MenuItemProps) => {
  let href = path.includes("game") ? path : `/post/${path}`;
  return (
    <li className='ml-3 list-inside'>
      <Link href={href}>
        {label}
      </Link>
      {subMenus ? (
        <ol className='list-disc'>
          {subMenus.map(
            ({ label: childLabel, id: childPath, subMenus: childChildren }) => (
              <MenuItem
                key={path + childLabel}
                label={childLabel}
                id={childPath}
                subMenus={childChildren}
              />
            ),
          )}
        </ol>
      ) : null}
    </li>
  );
};

interface SiderProps {}

export const Sider: React.FC<SiderProps> = () => {
  const menuArray = [
    {
      label: "Reading & Doing",
      id: "Reading & Doing",
      subMenus: getDirStructure(),
    },
    {
      label: "Old Tiny Games",
      id: "games",
      subMenus: [
        { label: "mine sweepers", id: "/game/mineSweepers" },
        { label: "snake", id: "/game/snake" },
        { label: "tetris", id: "/game/tetris" },
      ],
    },
  ];

  return (
    <div
      id='sider'
      className='absolute global-sider transition-all duration-500 
      overflow-x-hidden rounded-md
      overflow-y-scroll p-2 
      top-[calc(100%+0.2rem)] -left-2
      peer-[.toggle]:opacity-0 
      peer-[.toggle]:-z-20
      peer-[.toggle]:max-h-0
      peer-[.toggle:focus]:opacity-100 
      peer-[.toggle:focus]:z-20
      peer-[.toggle:focus]:max-h-[90vh]'
    >
      {menuArray.map(({ label, id, subMenus: menuItems }) => (
        <div key={label} className='rounded-md mb-2'>
          <p className=''>{label}</p>
          <ul className={"whitespace-nowrap list-inside list-disc "}>
            {menuItems
              ? menuItems.map(({ label, id, subMenus }) => (
                  <MenuItem
                    key={id + label}
                    label={label}
                    id={id}
                    subMenus={subMenus}
                  />
                ))
              : null}
          </ul>
        </div>
      ))}
    </div>
  );
};

Sider.displayName = "Sider";
