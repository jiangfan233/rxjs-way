import { useRouter } from "next/router";
import { FileStructure, getDirStructure } from "@lib/post";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function getStaticProps() {
  const menuArray = getDirStructure();
  return {
    props: {
      menuArray,
    },
  };
}


interface HomeProps {
  menuArray: FileStructure[];
}

export default function Home({ menuArray }: HomeProps) {
  const router = useRouter();
  const rxjs = menuArray.find((item) => item.label.includes("rxjs"));
  const [countDown, setCountDown] = useState(5);
  let timerRef = useRef<NodeJS.Timer | null>(null);
  

  useEffect(() => {
    if(timerRef.current !== null) return;
    timerRef.current = setInterval(() => {
      
      setCountDown(c => {
        let res = c - 1;
        if(res <= 0) {
          clearInterval(timerRef.current!);
          router.push(`/${ rxjs?.id || menuArray[0].id}`);
        }
        return res;
      });
    }, 1000);
  }, [countDown, setCountDown]);

  return <div className="p-2 text-2xl">
    Hi there, have a nice day~~
    <br />
    <Link className="mx-2 text-sky-600" href={`/${rxjs?.id || menuArray[0].id}`}>articles</Link>
    or
    <Link className="mx-2 font-bold text-sky-600" href={"/game"}>play games</Link> ...{ countDown }
  </div>;
}
