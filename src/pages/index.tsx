import { useRouter } from "next/router";
import { FileStructure, getDirStructure } from "@lib/post";
import { useEffect } from "react";
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

  useEffect(() => {
    requestAnimationFrame(() => {
      router.push(`/${ rxjs?.id || menuArray[0].id}`);
    })
  }, []);
  return <div>
    Hello!
    <Link className="mx-2 text-sky-600" href={`/${rxjs?.id || menuArray[0].id}`}>Click me</Link>
  </div>;
}
