import React from "react";
import Image from "next/image";

export const Header = React.memo(() => {
  return (
    <>
      <div className="w-full flex gap-4 items-center justify-center relative h-8">
        <h2 className="font-bold text-3xl">The Rxjs Way</h2>

        <a href="https://github.com/jiangfan233/learn-rxjs" target="_blank">
          <Image src={"github-mark.svg"} alt="Github" height={32} width={32} />
        </a>
      </div>
    </>
  );
});
