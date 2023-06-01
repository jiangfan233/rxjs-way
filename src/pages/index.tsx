"use client";
import { FileStructure, getDirStructure } from "../../lib/post";


export function getStaticProps() {
  const menuArray = getDirStructure();
  return {
    props: {
        menuArray,
    },
  };
}


interface HomeProps {
  menuArray: FileStructure[]
}

export default function Home({ menuArray}: HomeProps) {
  
  return (
    <div>Hello</div>
  )
}
