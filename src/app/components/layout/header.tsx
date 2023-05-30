import React from "react";
import { AiOutlineBars } from "react-icons/ai";


interface HeaderProps {
	toggleMenu: Function;
	isShowMenu: boolean;
}

export const Header = React.memo(({ toggleMenu, isShowMenu }: HeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-center relative h-8">
				<AiOutlineBars 
					className="absolute left-0"
					onClick={() => toggleMenu(!isShowMenu)}
				/>
        <h2>The Rxjs Way</h2>
      </div>
    </>
  );
});
